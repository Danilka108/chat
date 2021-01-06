import { forwardRef, Module } from '@nestjs/common'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'
import { MessageDBService } from './message-db.service'
import { RedisModule } from 'src/redis/redis.module'
import { TokenModule } from 'src/token/token.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { ContentModule } from 'src/content/content.module'
import { UserModule } from 'src/user/user.module'
import { DialogModule } from 'src/dialog/dialog.module'

@Module({
    imports: [
        RedisModule,
        TokenModule,
        ContentModule,
        UserModule,
        forwardRef(() => DialogModule),
        TypeOrmModule.forFeature([Message]),
    ],
    controllers: [MessageController],
    providers: [MessageService, MessageDBService],
    exports: [MessageDBService],
})
export class MessageModule {}
