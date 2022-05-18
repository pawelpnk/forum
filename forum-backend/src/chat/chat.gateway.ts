import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '../entity/message.entity';
import { ChatCreateMessage } from './chat.interface/chat-create-message.interface';
import { ChatService } from './chat.service';

@WebSocketGateway(5001, { cors: {origin: 'http://localhost:3000'}})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService
  ) {}

  @SubscribeMessage('message-from-client')
  async handleMessage(
    @MessageBody() content: ChatCreateMessage,
  ) {
    const message: Message = await this.chatService.createMessage(content);
    this.server.sockets.emit('new-message', message);
    return message;
  }

  @SubscribeMessage('all-message-from-database')
  async handleMessageResponse(
    @ConnectedSocket() socket: Socket,
    @MessageBody() id: string
  ){
    const messages: Message[] = await this.chatService.getAllMessageOneConversation(id);
    socket.emit('send-messages-group', messages);
  }
}
