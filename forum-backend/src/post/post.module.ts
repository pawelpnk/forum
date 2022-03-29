import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { TopicModule } from 'src/topic/topic.module';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(()=>UserModule),
    forwardRef(()=>TopicModule)
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [
    PostService
  ]
})
export class PostModule {}
