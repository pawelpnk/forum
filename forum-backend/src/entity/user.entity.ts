import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Topic } from "./topic.entity";
import { IsEmail } from 'class-validator';
import { Post } from "./post.entity";

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    role: string;

    @Column()
    active: boolean;

    @Column({
        type: 'timestamp with time zone',
       default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column()
    image: string;

    @OneToMany(() => Topic, (topic) => topic.user)
    topics: Topic[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post
}