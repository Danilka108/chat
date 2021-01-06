import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Content } from './content.entity'

export class ContentDBService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>
    ) {}

    async createContent(text: string, manager?: EntityManager) {
        const newContent = new Content()

        newContent.text = text

        if (manager) {
            const contentRepo = manager.getRepository(Content)
            return await contentRepo.save(newContent)
        } else {
            return await this.contentRepository.save(newContent)
        }
    }

    async editContent(text: string, content: Content) {
        content.text = text

        await this.contentRepository.save(content)
    }
}
