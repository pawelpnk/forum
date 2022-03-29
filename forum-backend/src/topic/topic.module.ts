import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/entity/topic.entity';
import { PostModule } from 'src/post/post.module';
import { SectionModule } from 'src/section/section.module';
import { SectionService } from 'src/section/section.service';
import { UserModule } from 'src/user/user.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Topic]),
        forwardRef(()=> UserModule),
        forwardRef(()=> SectionModule),
        forwardRef(()=> PostModule)
    ],
    controllers:[TopicController],
    providers: [TopicService],
    exports: [
        TopicService
    ]
})
export class TopicModule {}