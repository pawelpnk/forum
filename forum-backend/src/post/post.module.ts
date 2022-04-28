import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { Post } from 'src/entity/post.entity';
import { SectionModule } from 'src/section/section.module';
import { TopicModule } from 'src/topic/topic.module';
import { UserModule } from 'src/user/user.module';
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
