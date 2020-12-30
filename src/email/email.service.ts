import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { RedisChangeEmailService } from 'src/redis/services/redis-change-email.service'
import { RedisConfirmEmailService } from 'src/redis/services/redis-confirm-email.service'
import { RedisResetPasswordService } from 'src/redis/services/redis-reset-password.service'
import { UserDBService } from 'src/user/user-db.service'
import { QueryDto } from './dto/query.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class EmailService {
    constructor(
        private readonly redisConfirmEmailService: RedisConfirmEmailService,
        private readonly redisResetPasswordService: RedisResetPasswordService,
        private readonly redisChangeEmailService: RedisChangeEmailService,
        private readonly userDBService: UserDBService
    ) {}

    async confirmEmail({ id: userID, token: confirmEmailToken }: QueryDto) {
        const redisConfirmEmailToken = await this.redisConfirmEmailService.get(userID)

        if (!redisConfirmEmailToken) {
            throw new BadRequestException('Invalid confirm email link')
        }

        if (confirmEmailToken !== redisConfirmEmailToken) {
            throw new BadRequestException('Invalid confirm email link')
        }

        await this.redisConfirmEmailService.del(userID)
    }

    async resetPassword({ newPassword }: ResetPasswordDto, { id: userID, token: resetPasswordToken }: QueryDto) {
        const redisResetPasswordToken = await this.redisResetPasswordService.get(userID)

        if (!redisResetPasswordToken) {
            throw new UnauthorizedException('Invalid reset password link')
        }
        if (resetPasswordToken !== redisResetPasswordToken) {
            throw new UnauthorizedException('Invalid reset password link')
        }

        await this.userDBService.setNewPassword({ userID, newPassword }, {})

        await this.redisResetPasswordService.del(userID)
    }

    async changeEmail({ id: userID, token: changeEmailToken }: QueryDto) {
        const redisChangeEmailData = await this.redisChangeEmailService.get(userID)

        if (!redisChangeEmailData) {
            throw new UnauthorizedException('Invalid change email link')
        }
        if (changeEmailToken !== redisChangeEmailData.token) {
            throw new UnauthorizedException('Invalid change email link')
        }

        await this.userDBService.setNewEmail(userID, redisChangeEmailData.email)

        await this.redisChangeEmailService.del(userID)
    }
}
