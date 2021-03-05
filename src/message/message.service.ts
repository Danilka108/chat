import { Injectable, UnauthorizedException } from '@nestjs/common'
import { GatewayEvents } from 'src/common/events/gateway.events'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { transaction } from 'src/common/transaction'
import { ContentDBService } from 'src/content/content-db.service'
import { MessageDialogDBService } from 'src/dialog/message-dialog-db.service'
import { UserDBService } from 'src/user/user-db.service'
import { UserSocketManager } from 'src/user/user.socket-manager'
import { EditMessageDto } from './dto/edit-message.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { MessageDBService } from './message-db.service'
import { Message } from './message.entity'
import { parseMessage } from './parse-message'
import { parseDialog } from 'src/dialog/parse-dialog'

@Injectable()
export class MessageService {
    constructor(
        private readonly contentDBService: ContentDBService,
        private readonly messageDBService: MessageDBService,
        private readonly userDBService: UserDBService,
        private readonly messageDialogDBService: MessageDialogDBService,
        private readonly userSocketManager: UserSocketManager
    ) {}

    async getMessages(receiverID: number, take: number, skip: number, { userID }: IDecoded) {
        const sender = await this.userDBService.findById(userID, 'Sender user not found')
        const receiver = await this.userDBService.findById(receiverID, 'Receiver user not found')

        await this.messageDBService.markMessagesAsRead(receiver, sender)

        return (await this.messageDBService.find(sender, receiver, take, skip)).map(parseMessage)
    }

    async sendMessage(receiverID: number, { message }: SendMessageDto, { userID }: IDecoded) {
        const sender = await this.userDBService.findById(userID, 'Sender user not found')
        const receiver = await this.userDBService.findById(receiverID, 'Receiver user not found')

        return await transaction<Message>(
            async (manager) => {
                const isCreatedNewDialog = await this.messageDialogDBService.create(sender, receiver, manager)
                const newContent = await this.contentDBService.createContent(message, manager)
                const newMessage = await this.messageDBService.create(newContent, sender, receiver, manager)
                await this.messageDBService.markMessagesAsRead(receiver, sender, manager)

                if (isCreatedNewDialog) {
                    this.userSocketManager.emitToUser(
                        receiver.id,
                        GatewayEvents.user.newDialog,
                        parseDialog(sender, newMessage)
                    )
                }

                this.userSocketManager.emitToUser(receiver.id, GatewayEvents.user.newMessage, parseMessage(newMessage))

                return newMessage
            },
            (error) => {
                throw error
            }
        )
    }

    async updateMessage({ message }: EditMessageDto, messageID: number, { userID }: IDecoded) {
        const msg = await this.messageDBService.findOne(messageID)

        if (msg.sender.id !== userID) {
            throw new UnauthorizedException(
                'Insufficient rights to edit the message. You must be the sender of this message'
            )
        }

        await transaction(
            async (manager) => {
                const newContent = await this.contentDBService.createContent(message, manager)
                await this.messageDBService.update(newContent, msg, manager)
            },
            (error) => {
                throw error
            }
        )
    }

    async deleteMessage(messageID: number, { userID }: IDecoded) {
        const message = await this.messageDBService.findOne(messageID)

        if (message.sender.id !== userID) {
            throw new UnauthorizedException(
                'Insufficient rights to delete the message. You must be the sender of this message'
            )
        }

        await this.messageDBService.delete(message)

        const needDelDialog = await this.messageDBService.findOneOnlyIDBoolean(message.sender, message.receiver)

        if (!needDelDialog) {
            await this.messageDialogDBService.delete(message.sender, message.receiver)
        }
    }
}
