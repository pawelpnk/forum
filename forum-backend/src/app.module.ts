import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { PostModule } from './post/post.module';
import { TopicModule } from './topic/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { Message } from './entity/message.entity';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Message]),
    UserModule, 
    SectionModule, 
    PostModule, 
    TopicModule,
    AuthModule,
    CronModule,
    GroupModule,
  ],
  controllers: [
    AppController, 
    AuthController,
  ],
  providers: [
    AppService, 
    AuthService,
    ChatGateway,
    ChatService
  ],
})
export class AppModule {}
