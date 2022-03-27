import { Body, Controller, Post } from '@nestjs/common';
import { NewSection } from 'src/dto/new-section.dto';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
    constructor(private sectionService: SectionService) {}

    // @Post('/add')
    // async addNewSection(
    //     @Body() newSection: NewSection
    // ): Promise<any> {
    //     const addedSection = await this.sectionService.addSection(newSection);
    // }
}
