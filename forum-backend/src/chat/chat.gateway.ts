import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import { Group } from 'src/entity/group.entity';
import User from 'src/entity/user.entity';
import { ChatCreateMessage } from './chat.interface/chat-create-message.interface';
import { ChatService } from './chat.service';

@WebSocketGateway(5001, { cors: {origin: '*'}})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService
  ) {}
  @SubscribeMessage('message-from-client')
  async handleMessage(
    @UserObj() user: User,
    @MessageBody() content: ChatCreateMessage,
    @ConnectedSocket() socket: Socket
  ) {
    
    const findUser = socket.handshake.headers.cookie
    console.log(findUser)
    const message = await this.chatService.createMessage(user, content);
    this.server.sockets.emit('new-message', message)
    return message;
  }
  @SubscribeMessage('all-message-from-database')
  async handleMessageResponse(
    @UserObj() user: User,
    @ConnectedSocket() socket: Socket,
    @MessageBody() id: string
  ){

    const messages = await this.chatService.getAllMessageOneConversation(id);

    socket.emit('send-messages-group', messages);
    console.log(socket.emit('send-messages-group', messages))
  }
}
