import { forwardRef, Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { UserModule } from 'src/user/user.module'
import { EmailLogicService } from './email-logic.service'
import { RedisModule } from 'src/redis/redis.module'
import { TokenModule } from 'src/token/token.module'

@Module({
    imports: [forwardRef(() => UserModule), RedisModule, TokenModule],
    providers: [EmailService, EmailLogicService],
    controllers: [EmailController],
    exports: [EmailLogicService],
})
export class EmailModule {}
