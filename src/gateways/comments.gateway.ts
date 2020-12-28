import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

// TODO: add namespace
@WebSocketGateway()
export class CommentsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger("CommentsGateway");

  @WebSocketServer()
  private wss: Server;

  afterInit(server: Server) {
    this.logger.log("Initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("Client connected: ", client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected: ", client.id);
  }

  @SubscribeMessage("msgToServer")
  handleMessage(client: Socket, message: { sender: string; room: string; message: string }): void {
    this.wss.to(message.room).emit("msgToClient", message);
  }

  @SubscribeMessage("join")
  joinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("leave")
  leaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit("leftRoom", room);
  }
}
