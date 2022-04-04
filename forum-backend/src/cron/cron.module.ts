import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule
  ],
  providers: [CronService]
})
export class CronModule {}
