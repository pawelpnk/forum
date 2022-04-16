import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Topic } from "./topic.entity";
import { IsEmail } from 'class-validator';
import { Post } from "./post.entity";
import { OptionalUser } from "./optionalUser.entity";
import { Notification } from 'src/entity/notification.entity';

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

    @Column({
        nullable: true,
        default: null
    })
    token: string | null

    @Column()
    role: string;

    @Column()
    active: boolean;

    @Column({
        nullable: true
    })
    createdAt: string;

    @Column()
    image: string;

    @OneToMany(() => Topic, (topic) => topic.user)
    topics: Topic[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToOne(() => OptionalUser)
    @JoinColumn()
    optionalUser: OptionalUser

    @OneToMany(() => Notification, (noti)=> noti.user)
    notifications: Notification[]
}