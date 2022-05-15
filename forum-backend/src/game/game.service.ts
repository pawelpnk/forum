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
    };

    async getTopGames(): Promise<Games[]> {
        const allGames = await this.gameRepository.find({
            relations: [
                'user'   
            ],
            order: {
                numberPoints: 'DESC'
            },
            skip: 0,
            take: 5
        });
        allGames.map(item => {
            delete item.user.password;
            delete item.user.token;
            delete item.user.email;
        });
        return allGames;
    };

    async getTopGamesUser(user: User): Promise<Games[]> {
        const allGamesUser = await this.gameRepository.find({
            relations: [
                'user'   
            ],
            where: {
                user: {
                    id: user.id
                }
            },
            order: {
                numberPoints: 'DESC'
            },
            skip: 0,
            take: 5            
        });
        allGamesUser.map(item => {
            delete item.user.password;
            delete item.user.token;
            delete item.user.email;
        });
        return allGamesUser;
    };
}
