import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Like, Not, Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserDBService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create({ name, email, password }: { name: string; email: string; password: string }, manager: EntityManager) {
        const userRepo = manager.getRepository(User)

        const user = await this.findByEmailNotException(email)

        if (user) {
            throw new BadRequestException(`Email ${email} already in use`)
        }

        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = password

        return await userRepo.save(newUser)
    }

    async searchByName(userID: number, searchString: string) {
        return await this.userRepository.find({
            where: {
                id: Not(userID),
                name: Like(`%${searchString}%`),
            },
        })
    }

    async findById(id: number, errorMessage = 'User not found') {
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

    async findByEmail(email: string, errorMessage = 'User not found') {
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

    async verifyPassword(
        { password, hashPassword }: { password: string; hashPassword: string },
        errorMessage = 'Invalid password'
    ) {
        const isMatch = await bcrypt.compare(password, hashPassword)
        if (!isMatch) {
            throw new UnauthorizedException(errorMessage)
        }
    }

    async setNewPassword(
        { userID, newPassword, oldPassword }: { userID: number; newPassword: string; oldPassword?: string },
        { verifyMsg, findMsg }: { verifyMsg?: string; findMsg?: string },
        manager?: EntityManager
    ) {
        const user = await this.findById(userID, findMsg ? findMsg : undefined)

        if (oldPassword) {
            await this.verifyPassword(
                {
                    password: oldPassword,
                    hashPassword: user.password,
                },
                verifyMsg ? verifyMsg : undefined
            )
        }

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        user.password = await bcrypt.hash(newPassword, salt)

        if (manager) {
            await manager.save(user)
        } else {
            await this.userRepository.save(user)
        }
    }

    async setNewEmail(userID: number, newEmail: string, errorMessage?: string) {
        const user = await this.findById(userID, errorMessage ? errorMessage : undefined)

        user.email = newEmail

        await this.userRepository.save(user)
    }

    async setNewName(userID: number, newName: string, errorMessage?: string) {
        const user = await this.findById(userID, errorMessage ? errorMessage : undefined)

        user.name = newName

        await this.userRepository.save(user)
    }

    async setNewBio(userID: number, newBio: string, errorMessage?: string) {
        const user = await this.findById(userID, errorMessage ? errorMessage : undefined)

        user.bio = newBio

        await this.userRepository.save(user)
    }

    async delete(userID: number, password: string) {
        const user = await this.findById(userID)

        await this.verifyPassword({
            password,
            hashPassword: user.password,
        })

        user.email = ''
        user.is_deleted = true

        await this.userRepository.save(user)
    }
}
