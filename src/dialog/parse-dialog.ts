import { Message } from 'src/message/message.entity'
import { User } from 'src/user/user.entity'
import { IParsedDialog } from './interface/parsed-dialog.interface'

export const parseDialog = (receiver: User, lastMessage: Message, newMessagesCount = 0): IParsedDialog => ({
    receiverID: receiver.id,
    receiverName: receiver.name,
    lastMessage: lastMessage.content.text,
    createdAt: lastMessage.createdAt,
    newMessagesCount,
})
