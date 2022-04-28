import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/user/user.module';
import { ChatService } from 'src/chat/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    TypeOrmModule.forFeature([Message])
  ],
  providers: [CronService, ChatService]
})
export class CronModule {}
