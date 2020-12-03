import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { DeleteUserDto } from './dto/delete-user.dto'
import * as bcrypt from 'bcrypt'
import { EditNameDto } from './dto/edit-name.dto'
import { EditBioDto } from './dto/edit-bio.dto'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'

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

    async resetPassword(
        userID: number,
        oldPassword: string,
        newPassword: string,
        errorMessage: string = 'Invalid password'
    ) {
        const user = await this.findById(userID)

        await this.verifyPassword(oldPassword, user.password, errorMessage)

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        user.password = await bcrypt.hash(newPassword, salt)
        await this.userRepository.save(user)

        await this.redisService.delAllSessions(user.id)
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

    async editName({ newName }: EditNameDto, decoded: IDecoded) {
        const user = await this.findById(decoded.userID)

        user.name = newName
        await this.userRepository.save(user)
    }

    async editBio({ newBio }: EditBioDto, decoded: IDecoded) {
        const user = await this.findById(decoded.userID)

        user.bio = newBio
        await this.userRepository.save(user)
    }

    async editPassword(decoded: IDecoded) {
        const user = await this.findById(decoded.userID)

        await this.emailService.sendResetPassword(decoded.userID, user.email)
    }

    async delete({ password }: DeleteUserDto, decoded: IDecoded) {
        const user = await this.findById(decoded.userID)

        await this.verifyPassword(password, user.password)

        user.email = ''
        user.is_deleted = true

        await this.redisService.setDeleteUser(user.id)

        await this.userRepository.save(user)
    }
}
