import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { NewSection } from 'src/dto/new-section.dto';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
    constructor(private sectionService: SectionService) {}

    @Post('/add')
    async addNewSection(
        @Body() newSection: NewSection,
        @Res() res: Response
    ) {
        try {
            const addedSection = await this.sectionService.addSection(newSection);
            return res.status(HttpStatus.OK).json({
                message: 'Pomyślnie dodano nową sekcje',
                addedSection
            })
        } catch (err) {
            return res.json({
                message: err.message
            })
        }       
    }

    @Get('/')
    async getAllSections() {
        return await this.sectionService.getSections(); 
    }

    @Get(':id')
    async getOneSection(
        @Param('id') id: string
    ) {
        return await this.sectionService.findSection(id);
    }

    @Patch('/update/:id')
    async updateSection(
        @Res() res: Response,
        @Body() updateSection: NewSection,
        @Param('id') id: string
    ) {
        try {
            const updtSection = await this.sectionService.updateSectionName(id, updateSection);
            return res.status(HttpStatus.OK).json({
            message: 'Pomyślnie zaaktualizowano sekcje',
            updtSection
        })
        } catch (err) {
            return res.json({
                message: err.message
            })
        }
        
    }

    @Delete('/delete/:id')
    async deleteSection(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        try {
            await this.sectionService.deleteSection(id);
            return res.status(HttpStatus.OK).json({
            message: "Pomyślnie usunięto sekcje"
        })
        } catch (err) {
            return res.json({
                message: err.message
            })
        }
        
    }
}
