import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/entity/section.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section) private sectionEntity: Repository<Section> 
        ) {}

    // async addSection(sectionName): Promise<any> {

    // }
}
