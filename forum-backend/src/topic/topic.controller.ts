import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import RoleGuard from 'src/guard/roles.guards';
import { UserRole } from 'src/interface/user-role.interface';
import NewTopic from './topic.dto/new-topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
    constructor(private topicService: TopicService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/new')
    async addNewTopic(
        @Res() res: Response,
        @Body() newTopic: NewTopic
    ) {
        try {
            const addedNewTopic = await this.topicService.createTopic(newTopic);
            return res.status(HttpStatus.OK).json({
                message: "Dodano nowy temat",
                addedNewTopic
            })
        } catch {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Błędne dane"
            })
        }        
    }

    @Get('/one')
    async fetchOneTopic(
        @Res() res: Response,
        @Body() id: string
    ) {
        try {
            const fetchTopic = await this.topicService.fetchOneTopic(id);
            return res.status(HttpStatus.OK).json(fetchTopic);
        } catch (err) {
            return res.json({
                message: err
            })
        }        
    }

    @Get('/all/:sectionID')
    async fetchAllTopics(
        @Res() res: Response,
        @Param('sectionID') idSection: string
    ) {
        try {
            const fetchAllTopics = await this.topicService.fetchAllTopics(idSection);
            return res.status(HttpStatus.OK).json(fetchAllTopics);
        } catch {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Nie odnaleziono zasobu"
            })
        }
    }

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteTopic(
        @Res() res: Response,
        @Param('id') idTopic: string
    ) {
        try {
            await this.topicService.deleteTopic(idTopic);
            return res.status(HttpStatus.OK).json({
                message: "Temat usunięty"
            })
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })
        }
    }
}
