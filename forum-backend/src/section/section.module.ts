import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/entity/section.entity';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Section])
    ],
    controllers: [SectionController],
    providers: [SectionService]})

export class SectionModule {}

// type: 'postgres',
//         host: process.env.HOST,
//         port: +process.env.PORT,
//         username: 'postgres',
//         password: process.env.PASSWORD,
//         database: process.env.DATABASE,
//         entities: [
//           __dirname + '/../**/*.entity.ts',
//         ],
//         synchronize: true,
