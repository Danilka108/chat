import { IParsedMessage } from 'src/message/interface/parsed-message.interface'
import { Message } from './message.entity'

export const parseMessage = (message: Message): IParsedMessage => ({
    senderID: message.sender.id,
    receiverID: message.receiver.id,
    message: message.content.text,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    isUpdated: message.isUpdated,
    isReaded: message.isReaded,
    messageID: message.id,
})
