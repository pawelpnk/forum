import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export class Games {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    numberPoints: number;

    @ManyToOne(() => User, (user) => user.games, { cascade: true, onDelete: "SET NULL"})
    @JoinColumn({name: 'login'})
    user: User;

    @Column({nullable: true})
    userLogin: string;
}