import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Length } from 'class-validator';
import User from "./user.entity";
import { Topic } from "./topic.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Length(10, 300)
    text: string;

    @Column('int')
    rating: number;

    @Column()
    createAt: string;

    @Column()
    updateAt: string;

    @ManyToOne(() => User, (user) => user.posts, { cascade: true, onDelete: "SET NULL"})
    @JoinColumn({name: "login"})
    user: User;

    @Column({nullable: true})
    userId: string | null;

    @ManyToOne(() => Topic, (topic) => topic.posts, { cascade: true, onDelete:'CASCADE' })
    @JoinColumn({name: 'topicId'})
    topic: Topic;

    @Column()
    topicId: string;

    @Column("text", {
        array: true,
        default: []
    })
    userRated: string[];
}