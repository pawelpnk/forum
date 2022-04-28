import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CronService {
    constructor(
        private userService: UserService,
        private chatService: ChatService
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async checkFinishBan() {
        const findUsers = await this.userService.findAllBannedUsers();
        findUsers.filter(async user => {
            if(user.optionalUser.dateFinish <= new Date().toLocaleDateString()) {
                await this.userService.updatedBannedUser(user)
            }
        })
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteMessageAfterFiveDays() {
        await this.chatService.findMessagesOldestThenFiveDays();
    }
}

