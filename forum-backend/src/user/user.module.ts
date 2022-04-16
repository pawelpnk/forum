import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notification } from 'src/entity/notification.entity';
import { OptionalUser } from 'src/entity/optionalUser.entity';
import User from 'src/entity/user.entity';
import { NotiController } from 'src/noti/noti.controller';
import { NotiService } from 'src/noti/noti.service';
import { PostModule } from 'src/post/post.module';
import { TopicModule } from 'src/topic/topic.module';
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
