export interface IParsedMessage {
    senderID: number
    receiverID: number
    message: string
    createdAt: string
    updatedAt: string
    isUpdated: boolean
    isReaded: boolean
    messageID: number
}
