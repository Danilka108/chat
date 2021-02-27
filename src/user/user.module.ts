import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserDBService } from './user-db.service'
import { RedisModule } from 'src/redis/redis.module'
import { EmailModule } from 'src/email/email.module'
import { TokenModule } from 'src/token/token.module'
import { UserGateway } from './user.gateway'
import { UserSocketManager } from './user.socket-manager'

@Module({
    imports: [forwardRef(() => EmailModule), TypeOrmModule.forFeature([User]), RedisModule, TokenModule],
    providers: [UserDBService, UserService, UserGateway, UserSocketManager],
    controllers: [UserController],
    exports: [UserDBService],
})
export class UserModule {}
