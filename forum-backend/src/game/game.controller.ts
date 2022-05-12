import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import User from 'src/entity/user.entity';
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

    @Get('/top')
    async getTopGames () {
        return await this.gameService.getTopGames();
    }

    @UseGuards(JwtAuthGuard)
    @Get('top-user')
    async getTopGamesUser (
        @UserObj() user: User
    ) {
        return await this.gameService.getTopGamesUser(user);
    }
} 
