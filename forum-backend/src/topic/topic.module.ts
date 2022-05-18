import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '../entity/topic.entity';
import { PostModule } from '../post/post.module';
import { SectionModule } from '../section/section.module';
import { UserModule } from '../user/user.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Topic]),
        forwardRef(() => UserModule),
        forwardRef(() => SectionModule),
        forwardRef(() => PostModule)
    ],
    controllers:[TopicController],
    providers: [TopicService],
    exports: [
        TopicService
    ]
})
export class TopicModule {}
