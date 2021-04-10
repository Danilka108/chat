import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageDialogDBService } from './message-dialog-db.service'
import { MessageDialog } from './message-dialog.entity'
import { DialogController } from './dialog.controller'
import { DialogService } from './dialog.service'
import { MessageModule } from 'src/message/message.module'
import { RedisModule } from 'src/redis/redis.module'
import { TokenModule } from 'src/token/token.module'
import { UserModule } from 'src/user/user.module'

@Module({
    imports: [
        RedisModule,
        TokenModule,
        TypeOrmModule.forFeature([MessageDialog]),
        forwardRef(() => MessageModule),
        forwardRef(() => UserModule),
    ],
    controllers: [DialogController],
    providers: [DialogService, MessageDialogDBService],
    exports: [MessageDialogDBService],
})
export class DialogModule {}
