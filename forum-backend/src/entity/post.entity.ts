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

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({name: "userId"})
    user: User

    @Column()
    userId: string

    @ManyToOne(() => Topic, (topic) => topic.posts)
    @JoinColumn({name: 'topicId'})
    topic: Topic

    @Column()
    topicId: string
}