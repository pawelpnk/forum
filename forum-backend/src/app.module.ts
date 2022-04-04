import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SectionService } from './section/section.service';
import { SectionController } from './section/section.controller';
import { SectionModule } from './section/section.module';
import { PostModule } from './post/post.module';
import { TopicModule } from './topic/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    TypeOrmModule.forRoot(),
    UserModule, 
    SectionModule, 
    PostModule, 
    TopicModule,
    AuthModule,
    CronModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
