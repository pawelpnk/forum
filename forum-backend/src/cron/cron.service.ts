import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CronService {
    constructor(
        private userService: UserService
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async checkFinishBan() {
        const findUsers = await this.userService.findAllBannedUsers();
        findUsers.filter( async user => {
            if(user.optionalUser.dateFinish <= new Date().toLocaleDateString()) {
                await this.userService.updatedBannedUser(user)
            }
        })
    }
}

