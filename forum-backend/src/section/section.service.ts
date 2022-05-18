import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewSection } from '../section/section.dto/new-section.dto';
import { Section } from '../entity/section.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section) private sectionEntity: Repository<Section>,
        ) {}

    async addSection(sectionName: NewSection): Promise<Section> {
        console.log(sectionName.sectionName)
        if(!sectionName.sectionName) {
            throw new HttpException('Sekcja nie może mieć pustą nazwę', HttpStatus.BAD_REQUEST);
        }

        const newSection: Section = new Section();
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
        if(!sectionName.sectionName) {
            throw new HttpException('Sekcja nie może mieć pustą nazwę', HttpStatus.BAD_REQUEST);
        }
        await this.sectionEntity.update({id: id}, {sectionName: sectionName.sectionName});
        return this.sectionEntity.findOne(id);
    }

    async deleteSection(id: string): Promise<any> {
       return await this.sectionEntity.delete(id);
    }
}
