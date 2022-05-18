import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../entity/section.entity';
import { TopicModule } from '../topic/topic.module';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Section]),
        forwardRef(()=> TopicModule)
    ],
    controllers: [SectionController],
    providers: [SectionService],
    exports: [
        SectionService
    ]
    })

export class SectionModule {}
