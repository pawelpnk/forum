import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewSection } from 'src/dto/new-section.dto';
import { Section } from 'src/entity/section.entity';
import newSection from 'src/interface/new-section.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section) private sectionEntity: Repository<Section> 
        ) {}

    async addSection(sectionName: NewSection): Promise<newSection> {
       return await this.sectionEntity.save(sectionName);
    }

    async getSections(): Promise<newSection[]> {
        return await this.sectionEntity.find();
    }

    async updateSectionName(id: string, sectionName: NewSection): Promise<newSection> {
        await this.sectionEntity.update(id, sectionName);
        return this.sectionEntity.findOne(id);
    }

    async deleteSection(id: string): Promise<any> {
       return await this.sectionEntity.delete(id);
    }
}
