import { Body, Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import NewTopic from './topic.dto/new-topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
    constructor(private topicService: TopicService) {}

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

    @Get('/all')
    async fetchAllTopics(
        @Res() res: Response,
        @Body() idSection: string
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

    @Delete('/delete')
    async deleteTopic(
        @Res() res: Response,
        @Body() idTopic: string
    ) {
        try {
            await this.topicService.deleteTopic(idTopic);
            return res.status(HttpStatus.OK).json({
                message: "Temat usunięty"
            })
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: err
            })
        }
    }
}
