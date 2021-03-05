import { Injectable } from '@nestjs/common'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { MessageDBService } from 'src/message/message-db.service'
import { MessageDialogDBService } from './message-dialog-db.service'
import { parseDialog } from './parse-dialog'

@Injectable()
export class DialogService {
    constructor(
        private readonly messageDialogDBService: MessageDialogDBService,
        private readonly messageDBService: MessageDBService
    ) {}

    async getDialogs({ userID }: IDecoded) {
        const messageDialogs = await this.messageDialogDBService.getAll(userID)

        const dialogs = []

        for await (const key of messageDialogs) {
            const lastMessage = (await this.messageDBService.findLatest(key.interlocutor_1, key.interlocutor_2))[0]

            if (!lastMessage) {
                break
            }

            const receiver = lastMessage.sender.id === userID ? lastMessage.receiver : lastMessage.sender
            const user = lastMessage.sender.id === userID ? lastMessage.sender : lastMessage.receiver

            const newMessagesCount = (await this.messageDBService.findNotReaded(receiver, user)).length

            dialogs.push(parseDialog(receiver, lastMessage, newMessagesCount))
        }

        return dialogs
    }
}
