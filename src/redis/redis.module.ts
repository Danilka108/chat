import { Module } from '@nestjs/common'
import { RedisChangeEmailService } from './services/redis-change-email.service'
import { RedisConfirmEmailService } from './services/redis-confirm-email.service'
import { RedisDeleteUserService } from './services/redis-delete-user.service'
import { RedisResetPasswordService } from './services/redis-reset-password.service'
import { RedisSessionService } from './services/redis-session.service'

@Module({
    providers: [
        RedisChangeEmailService,
        RedisConfirmEmailService,
        RedisDeleteUserService,
        RedisResetPasswordService,
        RedisSessionService,
    ],
    exports: [
        RedisChangeEmailService,
        RedisConfirmEmailService,
        RedisDeleteUserService,
        RedisResetPasswordService,
        RedisSessionService,
    ],
})
export class RedisModule {}
