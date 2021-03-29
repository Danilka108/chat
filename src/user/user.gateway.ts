import { UseGuards } from '@nestjs/common'
import {
    ConnectedSocket,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsDecoded } from 'src/common/decorator/ws-decoded.decorator'
import { WsIp } from 'src/common/decorator/ws-ip.decorator'
import { WsSession } from 'src/common/decorator/ws-session.decorator'
import { GatewayEvents } from 'src/common/events/gateway.events'
import { WsAuthGuard } from 'src/common/guard/ws-auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { IWsSession } from 'src/common/interface/ws-session.interface'
import { IRedisSession } from 'src/redis/interface/redis-session.interface'
import { UserSocketManager } from './user.socket-manager'

@WebSocketGateway()
export class UserGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private readonly socketServer!: Server

    constructor(private readonly userSocketManager: UserSocketManager) {}

    @UseGuards(WsAuthGuard)
    @SubscribeMessage(GatewayEvents.user.connect)
    handleUserConnect(
        @ConnectedSocket() socket: Socket,
        @WsDecoded() { userID }: IDecoded,
        @WsIp() ip: string,
        @WsSession() { os, browser }: IWsSession
    ) {
        const session: IRedisSession = {
            userID,
            os,
            browser,
            ip,
        }

        this.userSocketManager.addUserSessionSocket(session, socket)

        this.userSocketManager.emitToUser(userID, GatewayEvents.user.connectSuccess)
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.userSocketManager.removeUserSessionSocket(socket)
    }
}
