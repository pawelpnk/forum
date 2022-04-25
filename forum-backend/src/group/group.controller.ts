import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import User from 'src/entity/user.entity';
import { NewGroup } from './group.interface/new-group.interface';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
    constructor(
        private groupService: GroupService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createNewGroup(
        @UserObj() user: User,
        @Res() res: Response,
        @Body() content: NewGroup
    ) {
        const createConversation = await this.groupService.createGroup(user, content);
        return res.status(HttpStatus.OK).json(createConversation);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getsAllGroups(
        @UserObj() user: User,
        @Res() res: Response
    ) {
        const allGroups = await this.groupService.getGroups(user);
        return res.status(HttpStatus.OK).json(allGroups);
    }
}
