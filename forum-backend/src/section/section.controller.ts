import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { NewSection } from 'src/section/section.dto/new-section.dto';
import RoleGuard from 'src/guard/roles.guards';
import { UserRole } from 'src/user/user.interface/user-role.interface';
import { SectionService } from './section.service';
import { Section } from 'src/entity/section.entity';

@Controller('section')
export class SectionController {
    constructor(private sectionService: SectionService) {}

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async addNewSection(
        @Body() newSection: NewSection,
        @Res() res: Response
    ) {
        try {
            const addedSection: Section = await this.sectionService.addSection(newSection);
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
    async getAllSections(): Promise<Section[]> {
        return await this.sectionService.getSections(); 
    }

    @Get(':id')
    async getOneSection(
        @Param('id') id: string
    ): Promise<Section> {
        return await this.sectionService.findSection(id);
    }

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id')
    async updateSection(
        @Res() res: Response,
        @Body() updateSection: NewSection,
        @Param('id') id: string
    ) {
        try {
            const updtSection: Section = await this.sectionService.updateSectionName(id, updateSection);
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

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
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
