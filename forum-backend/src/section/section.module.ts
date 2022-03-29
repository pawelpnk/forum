import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/entity/section.entity';
import { TopicModule } from 'src/topic/topic.module';
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
