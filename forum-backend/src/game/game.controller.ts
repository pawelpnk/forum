import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserObj } from '../decorators/user.decorator';
import { Games } from '../entity/games.entity';
import User from '../entity/user.entity';
import { NewGame } from './game.dto/new-game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async sendPoints (
        @UserObj() user: User,
        @Body() body: NewGame
    ) {
        return await this.gameService.newGame(user, body);
    }

    @Get('/all')
    async getTopGames (
        @Res() res: Response
    ) {
        const getTopGames: Games[] = await this.gameService.getTopGames();
        return res.status(HttpStatus.OK).json(getTopGames);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/top-user')
    async getTopGamesUser (
        @UserObj() user: User,
        @Res() res: Response
    ) {
        const getTopGamesUser: Games[] =  await this.gameService.getTopGamesUser(user);
        return res.status(HttpStatus.OK).json(getTopGamesUser);
    }
} 
