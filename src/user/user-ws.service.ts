import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserSocketManager } from "./user.socket-manager";

@Injectable()
export class UserWsService {
    constructor(
        private readonly userSocketManager: UserSocketManager
    ) {}
}