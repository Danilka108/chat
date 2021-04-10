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
import { UserWsService } from './user-ws.service'
import { UserSocketManager } from './user.socket-manager'

@WebSocketGateway()
export class UserGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private readonly socketServer!: Server

    constructor(private readonly userSocketManager: UserSocketManager, private readonly userWsService: UserWsService) {}

    @UseGuards(WsAuthGuard)
    @SubscribeMessage(GatewayEvents.user.connect)
    async userConnect(
        @ConnectedSocket() socket: Socket,
        @WsDecoded() decoded: IDecoded,
        @WsIp() ip: string,
        @WsSession() session: IWsSession
    ) {
        await this.userWsService.userConnect(socket, decoded, ip, session)
    }

    async handleDisconnect(socket: Socket) {
        await this.userWsService.userDisconnect(socket)
    }
}
