import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import User from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { ChatCreateMessage } from './chat.interface/chat-create-message.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>
    ) {}

    async createMessage(user: User, message: ChatCreateMessage): Promise<Message> {

        const newMessage: Message = new Message();
        newMessage.text = message.text;
        newMessage.author = user;
        newMessage.group = message.group;

        const saveMessage = await this.messageRepository.save(newMessage);

        return saveMessage;
    }

    async getAllMessageOneConversation(id: string): Promise<Message[]> {
        const findMessages = this.messageRepository.find({
            relations: ['group'],
            where: {
                group: {
                    id
                }
            }            
        })

        return findMessages;
    }
}
