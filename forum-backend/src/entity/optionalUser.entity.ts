import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export class OptionalUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @Column()
    dateFinish: string;

    @OneToOne(() => User)
    user: User
}