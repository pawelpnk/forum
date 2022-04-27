import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Topic } from "./topic.entity";
import { IsEmail } from 'class-validator';
import { Post } from "./post.entity";
import { OptionalUser } from "./optionalUser.entity";
import { Notification } from 'src/entity/notification.entity';
import { Message } from "./message.entity";
import { Group } from "./group.entity";
import { Games } from "./games.entity";

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
    
    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable()
    groups: Group[];

    @OneToMany(() => Games, (games) => games.user)
    games: Games[];
}