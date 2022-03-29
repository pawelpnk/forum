import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/entity/user.entity';
import { PostModule } from 'src/post/post.module';
import { TopicModule } from 'src/topic/topic.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(()=> AuthModule),
    forwardRef(()=> PostModule),
    forwardRef(() => TopicModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService
  ]
})
export class UserModule {}
