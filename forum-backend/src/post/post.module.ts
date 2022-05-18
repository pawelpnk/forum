import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entity/notification.entity';
import { Post } from '../entity/post.entity';
import { SectionModule } from '../section/section.module';
import { TopicModule } from '../topic/topic.module';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Notification]),
    forwardRef(()=>UserModule),
    forwardRef(()=>TopicModule),
    SectionModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [
    PostService
  ]
})
export class PostModule {}
