import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewSection } from 'src/dto/new-section.dto';
import { Section } from 'src/entity/section.entity';
import newSection from 'src/interface/new-section.interface';
import { TopicService } from 'src/topic/topic.service';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section) private sectionEntity: Repository<Section>,
        ) {}

    async addSection(sectionName: NewSection): Promise<Section> {
        const newSection = new Section();
        newSection.sectionName = sectionName.sectionName;

        await this.sectionEntity.save(newSection);
        return newSection;
    }

    async getSections(): Promise<Section[]> {
        return await this.sectionEntity.find();
    }

    async findSection(id: string): Promise<Section> {
        return await this.sectionEntity.findOneOrFail(id);
    }

    async updateSectionName(id: string, sectionName: NewSection): Promise<Section> {
        await this.sectionEntity.update(id, sectionName);
        return this.sectionEntity.findOne(id);
    }

    async deleteSection(id: string): Promise<any> {
       return await this.sectionEntity.delete(id);
    }
}