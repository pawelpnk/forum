import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from 'src/entity/games.entity';
import User from 'src/entity/user.entity';
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
    }

    async getTopGames(): Promise<Games[]> {
        return await this.gameRepository.find({
            order: {
                numberPoints: 'DESC'
            },
            skip: 0,
            take: 5
        });
    }

    async getTopGamesUser(user: User): Promise<Games[]> {
        return await this.gameRepository.find({
            where: {
                user: user
            },
            skip: 0,
            take: 5
        })
    }
}
