import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from '../entity/games.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
    imports: [TypeOrmModule.forFeature([Games])],
    controllers: [GameController],
    providers: [GameService]
})
export class GameModule {}
