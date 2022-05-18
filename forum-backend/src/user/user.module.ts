import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Notification } from '../entity/notification.entity';
import { OptionalUser } from '../entity/optionalUser.entity';
import User from '../entity/user.entity';
import { NotiController } from '../noti/noti.controller';
import { NotiService } from '../noti/noti.service';
import { PostModule } from '../post/post.module';
import { TopicModule } from '../topic/topic.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OptionalUser, Notification]),
    forwardRef(()=> AuthModule),
    forwardRef(()=> PostModule),
    forwardRef(()=> TopicModule)
  ],
  controllers: [UserController, NotiController],
  providers: [UserService, NotiService],
  exports: [
    UserService
  ]
})
export class UserModule {}
