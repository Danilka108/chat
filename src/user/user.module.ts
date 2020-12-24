import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserDBService } from './user-db.service'
import { RedisModule } from 'src/redis/redis.module'
import { EmailModule } from 'src/email/email.module'
import { TokenModule } from 'src/token/token.module'

@Module({
    imports: [forwardRef(() => EmailModule), TypeOrmModule.forFeature([User]), RedisModule, TokenModule],
    providers: [UserDBService, UserService],
    controllers: [UserController],
    exports: [UserDBService],
})
export class UserModule {}
