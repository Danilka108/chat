import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { EntityManager, Repository } from 'typeorm'
import { MessageDialog } from './message-dialog.entity'

export class MessageDialogDBService {
    constructor(
        @InjectRepository(MessageDialog)
        private readonly messageDialogRepository: Repository<MessageDialog>
    ) {}

    async getAll(id: number) {
        return await this.messageDialogRepository.find({
            relations: ['interlocutor_1', 'interlocutor_2'],
            where: [
                {
                    interlocutor_1: id,
                },
                {
                    interlocutor_2: id,
                },
            ],
        })
    }

    async create(interlocutor1: User, interlocutor2: User, manager: EntityManager) {
        const dialog = await this.find(interlocutor1, interlocutor2)

        if (!dialog) {
            const newMessageDialog = new MessageDialog()

            newMessageDialog.interlocutor_1 = interlocutor1
            newMessageDialog.interlocutor_2 = interlocutor2

            const messageDialogRepo = manager.getRepository(MessageDialog)

            await messageDialogRepo.save(newMessageDialog)
        }
    }

    async delete(interlocutor1: User, interlocutor2: User) {
        const dialog = await this.find(interlocutor1, interlocutor2)

        if (dialog) {
            await this.messageDialogRepository.delete(dialog)
        }
    }

    async find(interlocutor1: User, interlocutor2: User) {
        const messageDialog = await this.messageDialogRepository.findOne({
            where: [
                {
                    interlocutor_1: interlocutor1,
                    interlocutor_2: interlocutor2,
                },
                {
                    interlocutor_1: interlocutor2,
                    interlocutor_2: interlocutor1,
                },
            ],
        })

        if (!messageDialog) {
            return null
        } else {
            return messageDialog
        }
    }
}
