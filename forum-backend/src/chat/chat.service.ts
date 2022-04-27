import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import User from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChatCreateMessage } from './chat.interface/chat-create-message.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {}

    async createMessage(message: ChatCreateMessage): Promise<Message> {

        const findUser: User = await this.userService.findUserHelper(message.userLogin);
        
        if(!findUser) throw new HttpException("Nie ma takiego użytkownika", HttpStatus.BAD_REQUEST);

        const newMessage: Message = new Message();
        newMessage.text = message.text;
        newMessage.author = findUser.login;
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
