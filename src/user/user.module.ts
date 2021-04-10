import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserDBService } from './user-db.service'
import { RedisModule } from 'src/redis/redis.module'
import { EmailModule } from '../email/email.module'
import { TokenModule } from 'src/token/token.module'
import { UserGateway } from './user.gateway'
import { UserSocketManager } from './user.socket-manager'
import { UserWsService } from './user-ws.service'
import { DialogModule } from 'src/dialog/dialog.module'

@Module({
    imports: [
        forwardRef(() => DialogModule),
        forwardRef(() => EmailModule),
        TypeOrmModule.forFeature([User]),
        RedisModule,
        TokenModule,
    ],
    providers: [UserWsService, UserDBService, UserService, UserGateway, UserSocketManager],
    controllers: [UserController],
    exports: [UserDBService, UserSocketManager],
})
export class UserModule {}
