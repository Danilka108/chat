import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { DeleteUserDto } from './dto/delete-user.dto'
import * as bcrypt from 'bcrypt'
import { ChangeNameDto } from './dto/change-name.dto'
import { ChangeBioDto } from './dto/change-bio.dto'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'
import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => EmailService))
        private readonly emailService: EmailService,
        private readonly redisService: RedisService
    ) {}

    async findById(id: number, errorMessage: string = 'User not found') {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        })

        if (!user) {
            throw new BadRequestException(errorMessage)
        }

        return user
    }

    async findByEmail(email: string, errorMessage: string = 'User not found') {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        })

        if (!user) {
            throw new BadRequestException(errorMessage)
        }

        return user
    }

    async verifyPassword(password: string, hashPassword: string, errorMessage: string = 'Invalid password') {
        const isMatch = await bcrypt.compare(password, hashPassword)
        if (!isMatch) {
            throw new UnauthorizedException(errorMessage)
        }
    }

    async setNewPassword(userID: number, newPassword: string) {
        const user = await this.findById(userID)

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        user.password = await bcrypt.hash(newPassword, salt)
        await this.userRepository.save(user)

        await this.redisService.delAllSessions(user.id)
    }

    async setNewEmail(userID: number, newEmail: string, errorMessage: string = 'User not found') {
        const user = await this.findById(userID, errorMessage)

        user.email = newEmail

        await this.userRepository.save(user)
    }

    async create({ name, email, password }: CreateUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        })

        if (user) {
            throw new BadRequestException('This email already in use')
        }

        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = password
        newUser.is_deleted = false

        await this.userRepository.save(newUser)

        await this.emailService.sendConfirmEmail(newUser.id, newUser.email)
    }

    async changeName({ newName }: ChangeNameDto, { userID }: IDecoded) {
        const user = await this.findById(userID)

        user.name = newName
        await this.userRepository.save(user)
    }

    async changeBio({ newBio }: ChangeBioDto, { userID }: IDecoded) {
        const user = await this.findById(userID)

        user.bio = newBio
        await this.userRepository.save(user)
    }

    async changePassword({ oldPassword, newPassword }: ChangePasswordDto, { userID }: IDecoded) {
        const user = await this.findById(userID)

        await this.verifyPassword(oldPassword, user.password)

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        user.password = await bcrypt.hash(newPassword, salt)
        await this.userRepository.save(user)

        await this.redisService.delAllSessions(userID)
    }

    async changeEmail({ password, newEmail }: ChangeEmailDto, { userID }: IDecoded) {
        const user = await this.findById(userID)

        if (user.email === newEmail) {
            throw new BadRequestException('This email already in use')
        }

        await this.verifyPassword(password, user.password)

        await this.emailService.sendChangeEmail(userID, newEmail)
    }

    async resetPassword({ email }: ResetPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        })

        if (user) {
            await this.emailService.sendResetPassword(user.id, email)
        }
    }

    async delete({ password }: DeleteUserDto, { userID }: IDecoded) {
        const user = await this.findById(userID)

        await this.verifyPassword(password, user.password)

        user.email = ''
        user.is_deleted = true

        await this.redisService.setDeleteUser(userID)

        await this.userRepository.save(user)
    }
}
