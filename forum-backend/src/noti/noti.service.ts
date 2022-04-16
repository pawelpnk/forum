import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/entity/notification.entity';

@Injectable()
export class NotiService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>
    ) {}

    async UpdateDisplayNotification(user): Promise<any> {
        const updt = await this.notificationRepository.update({
            user: user
        },{
            toDisplay:false
        })

        return updt
    }

}
