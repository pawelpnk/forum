import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Notification } from 'src/entity/notification.entity';
import User from 'src/entity/user.entity';

@Injectable()
export class NotiService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>
    ) {}

    async UpdateDisplayNotification(user: User): Promise<UpdateResult> {
        const updt = await this.notificationRepository.update({
            user: user
        },{
            toDisplay:false
        })

        return updt
    }

    getNoti(user: User) {
        const findNoti = this.notificationRepository.find({
            where: {
                toWho: user.login
            },
            order: {
                createAt: 'DESC'
            },
            skip: 0,
            take: 7
        })
        return findNoti;
    }

}
