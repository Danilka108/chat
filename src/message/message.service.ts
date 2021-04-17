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
import { parseMessage } from './parse-message'
import { parseDialog } from 'src/dialog/parse-dialog'
import { IParsedMessage } from './interface/parsed-message.interface'

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

        if (skip === 0) {
            await this.messageDBService.markMessagesAsRead(receiver, sender)
            if (sender.id !== receiver.id) {
                this.userSocketManager.emitToUser(receiver.id, GatewayEvents.user.allMessagesRead, sender.id)
            }
        }

        return (await this.messageDBService.find(sender, receiver, take, skip)).map(parseMessage)
    }

    async sendMessage(receiverID: number, { message }: SendMessageDto, { userID }: IDecoded) {
        const sender = await this.userDBService.findById(userID, 'Sender user not found')
        const receiver = await this.userDBService.findById(receiverID, 'Receiver user not found')

        return await transaction<IParsedMessage>(
            async (manager) => {
                const isCreatedNewDialog = await this.messageDialogDBService.create(sender, receiver, manager)
                const newContent = await this.contentDBService.createContent(message, manager)
                const newMessage = await this.messageDBService.create(
                    sender.id === receiver.id,
                    newContent,
                    sender,
                    receiver,
                    manager
                )
                await this.messageDBService.markMessagesAsRead(receiver, sender, manager)

                if (isCreatedNewDialog) {
                    const userConnectionStatus = this.userSocketManager.findUserSessions(sender.id).length
                        ? 'online'
                        : 'offline'

                    const receiverConnectionStatus = this.userSocketManager.findUserSessions(receiver.id).length
                        ? 'online'
                        : 'offline'

                    this.userSocketManager.emitToUser(
                        receiver.id,
                        GatewayEvents.user.newDialog,
                        parseDialog(sender, newMessage, userConnectionStatus)
                    )
                    this.userSocketManager.emitToUser(
                        sender.id,
                        GatewayEvents.user.newDialog,
                        parseDialog(receiver, newMessage, receiverConnectionStatus)
                    )
                }

                if (sender.id !== receiver.id) {
                    this.userSocketManager.emitToUser(
                        receiver.id,
                        GatewayEvents.user.newMessage,
                        parseMessage(newMessage)
                    )
                    this.userSocketManager.emitToUser(
                        sender.id,
                        GatewayEvents.user.newMessage,
                        parseMessage(newMessage)
                    )
                } else {
                    this.userSocketManager.emitToUser(
                        sender.id,
                        GatewayEvents.user.newMessage,
                        parseMessage(newMessage)
                    )
                }
                this.userSocketManager.emitToUser(receiver.id, GatewayEvents.user.allMessagesRead, sender.id)

                return parseMessage(newMessage)
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

    async notReadedMessages(receiverID: number, { userID }: IDecoded) {
        const receiver = await this.userDBService.findById(receiverID)
        const user = await this.userDBService.findById(userID)

        const notReadedMessages = await this.messageDBService.findNotReaded(receiver, user)

        return notReadedMessages.length
    }

    async messageRead(messageID: number, { userID }: IDecoded) {
        const message = await this.messageDBService.findOne(messageID)

        if (message.receiver.id !== userID) {
            throw new UnauthorizedException(
                'Insufficient rights to mark the message as read. You must be the receiver of this message'
            )
        }

        await this.messageDBService.markMessageAsRead(message)

        this.userSocketManager.emitToUser(message.sender.id, GatewayEvents.user.messageRead, {
            receiverID: message.receiver.id,
            messageID,
        })
    }
}
