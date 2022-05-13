import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @Column()
    toDisplay: boolean;

    @Column()
    topicId: string;

    @Column()
    fromWho: string;

    @Column()
    toWho: string;

    @Column()
    createAt: string;

    @ManyToOne(() => User, (user) => user.notifications, { cascade: true, onDelete:'CASCADE' })
    user: User;
}