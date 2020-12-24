import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserDBService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(name: string, email: string, password: string) {
        const user = await this.findByEmailNotException(email)

        if (user) {
            throw new BadRequestException(`Email ${email} already in use`)
        }

        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = password

        return await this.userRepository.save(newUser)
    }

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

    async findByIdNotException(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        })

        if (!user) {
            return null
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

    async findByEmailNotException(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        })

        if (!user) {
            return null
        }

        return user
    }

    async verifyPassword(password: string, hashPassword: string, errorMessage: string = 'Invalid password') {
        const isMatch = await bcrypt.compare(password, hashPassword)
        if (!isMatch) {
            throw new UnauthorizedException(errorMessage)
        }
    }

    async setNewPassword(
        userID: number,
        newPassword: string,
        oldPassword?: string,
        verifyErrorMessage: string = 'Invalid password',
        errorMessage: string = 'User not found'
    ) {
        const user = await this.findById(userID, errorMessage)

        if (oldPassword) {
            await this.verifyPassword(oldPassword, user.password, verifyErrorMessage)
        }

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        user.password = await bcrypt.hash(newPassword, salt)
        await this.userRepository.save(user)
    }

    async setNewEmail(userID: number, newEmail: string, errorMessage: string = 'User not found') {
        const user = await this.findById(userID, errorMessage)

        user.email = newEmail

        await this.userRepository.save(user)
    }

    async setNewName(userID: number, newName: string, errorMessage: string = 'User not found') {
        const user = await this.findById(userID, errorMessage)

        user.name = newName

        await this.userRepository.save(user)
    }

    async setNewBio(userID: number, newBio: string, errorMessage: string = 'User not found') {
        const user = await this.findById(userID, errorMessage)

        user.bio = newBio

        await this.userRepository.save(user)
    }

    async delete(userID: number, password: string) {
        const user = await this.findById(userID)

        await this.verifyPassword(password, user.password)

        user.email = ''
        user.is_deleted = true

        await this.userRepository.save(user)
    }
}
