import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { GatewayEvents } from 'src/common/events/gateway.events'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { IWsSession } from 'src/common/interface/ws-session.interface'
import { MessageDialogDBService } from 'src/dialog/message-dialog-db.service'
import { IRedisSession } from 'src/redis/interface/redis-session.interface'
import { UserSocketManager } from './user.socket-manager'

@Injectable()
export class UserWsService {
    constructor(
        private readonly userSocketManager: UserSocketManager,
        private readonly messageDialogDBService: MessageDialogDBService
    ) {}

    private async emitConnectionStatusToReceivers(userID: number, connectionStatus: 'offline' | 'online') {
        const dialogs = await this.messageDialogDBService.getAll(userID)

        for (const dialog of dialogs) {
            if (dialog.interlocutor_1.id === userID) {
                this.userSocketManager.emitToUser(dialog.interlocutor_2.id, GatewayEvents.user.connectionStatus, {
                    receiverID: userID,
                    connectionStatus: connectionStatus,
                })
            } else if (dialog.interlocutor_2.id === userID) {
                this.userSocketManager.emitToUser(dialog.interlocutor_1.id, GatewayEvents.user.connectionStatus, {
                    receiverID: userID,
                    connectionStatus: connectionStatus,
                })
            }
        }
    }

    async userConnect(socket: Socket, { userID }: IDecoded, ip: string, { os, browser }: IWsSession) {
        const session: IRedisSession = {
            userID,
            os,
            browser,
            ip,
        }

        this.userSocketManager.addUserSessionSocket(session, socket)

        this.userSocketManager.emitToUser(userID, GatewayEvents.user.connectSuccess)

        await this.emitConnectionStatusToReceivers(userID, 'online')
    }

    async userDisconnect(socket: Socket) {
        const userID = this.userSocketManager.getUserIDBySocket(socket)

        this.userSocketManager.removeUserSessionSocket(socket)

        if (userID !== null) {
            const sessions = this.userSocketManager.findUserSessions(userID)

            if (sessions.length === 0) {
                await this.emitConnectionStatusToReceivers(userID, 'offline')
            }
        }
    }
}
