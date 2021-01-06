import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentDBService } from './content-db.service'
import { Content } from './content.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Content])],
    providers: [ContentDBService],
    exports: [ContentDBService],
})
export class ContentModule {}
