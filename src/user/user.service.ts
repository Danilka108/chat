import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { ChangeNameDto } from './dto/change-name.dto'
import { ChangeBioDto } from './dto/change-bio.dto'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserDBService } from './user-db.service'
import { EmailLogicService } from '../email/email-logic.service'
import { RedisSessionService } from 'src/redis/services/redis-session.service'
import { RedisDeleteUserService } from 'src/redis/services/redis-delete-user.service'
import { CheckEmailDto } from './dto/check-email.dto'
import { transaction } from 'src/common/transaction'

@Injectable()
export class UserService {
    constructor(
        private readonly emailLogicService: EmailLogicService,
        private readonly redisSessionService: RedisSessionService,
        private readonly redisDeleteUserService: RedisDeleteUserService,
        private readonly userDBService: UserDBService
    ) {}

    async create({ name, email, password }: CreateUserDto) {
        await transaction(
            async (manager) => {
                const newUser = await this.userDBService.create(
                    {
                        name,
                        email,
                        password,
                    },
                    manager
                )

                await this.emailLogicService.sendConfirmEmail(newUser.id, newUser.email)
            },
            (error) => {
                throw error
            }
        )
    }

    async getName(userID: number) {
        const user = await this.userDBService.findById(userID)

        return user.name
    }

    async checkEmail({ email }: CheckEmailDto) {
        const user = await this.userDBService.findByEmailNotException(email)
        if (user) {
            throw new BadRequestException('Email already in use')
        }
    }

    async changeName({ newName }: ChangeNameDto, { userID }: IDecoded) {
        await this.userDBService.setNewName(userID, newName)
    }

    async changeBio({ newBio }: ChangeBioDto, { userID }: IDecoded) {
        await this.userDBService.setNewBio(userID, newBio)
    }

    async changePassword({ oldPassword, newPassword }: ChangePasswordDto, { userID }: IDecoded) {
        await transaction(
            async (manager) => {
                await this.userDBService.setNewPassword(
                    {
                        userID,
                        newPassword,
                        oldPassword,
                    },
                    {},
                    manager
                )

                await this.redisSessionService.delAll(userID)
            },
            (error) => {
                throw error
            }
        )
    }

    async changeEmail({ password, newEmail }: ChangeEmailDto, { userID }: IDecoded) {
        const user = await this.userDBService.findById(userID)

        if (user.email === newEmail) {
            throw new BadRequestException('Email already in use')
        }

        const isInUse = await this.userDBService.findByEmailNotException(newEmail)

        if (isInUse) {
            throw new BadRequestException('Email already in use')
        }

        await this.userDBService.verifyPassword({
            password,
            hashPassword: user.password,
        })

        await this.emailLogicService.sendChangeEmail(userID, newEmail)
    }

    async resetPassword({ email }: ResetPasswordDto) {
        const user = await this.userDBService.findByEmailNotException(email)

        if (user) {
            await this.emailLogicService.sendResetPassword(user.id, email)
        }
    }

    async delete({ password }: DeleteUserDto, { userID }: IDecoded) {
        await this.userDBService.delete(userID, password)

        await this.redisDeleteUserService.set(userID)
    }
}
