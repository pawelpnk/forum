import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from '../entity/games.entity';
import User from '../entity/user.entity';
import { Repository } from 'typeorm';
import { NewGame } from './game.dto/new-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Games) private gameRepository: Repository<Games>
    ) {}

    async newGame(user: User, body: NewGame): Promise<Games> {
        const newGame = new Games();
        newGame.name = body.name;
        newGame.numberPoints = body.numberPoints;
        newGame.user = user;
        return await this.gameRepository.save(newGame);
    };

    async getTopGames(): Promise<Games[]> {
        const allGames = await this.gameRepository.find({
            order: {
                numberPoints: 'DESC'
            },
            skip: 0,
            take: 5            
        });
        return allGames;
    };

    async getTopGamesUser(user: User): Promise<Games[]> {
        const allGamesUser = await this.gameRepository.find({
            where: {
                userLogin: user.login
            },
            order: {
                numberPoints: 'DESC'
            },
            skip: 0,
            take: 5            
        });
        return allGamesUser;
    };
}
