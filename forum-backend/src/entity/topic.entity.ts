import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { Section } from "./section.entity";
import User from "./user.entity";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Length(10, 1000)
    topic: string;

    @Column()
    createdAt: string;

    @Column()
    updatedAt: string;

    @ManyToOne(() => User, (user) => user.topics, { cascade: true, onDelete: "SET NULL"})
    @JoinColumn({name: "login"},)
    user: User;

    @Column({nullable: true})
    userId: string;

    @ManyToOne(() => Section, (section) => section.topics, { cascade: true, onDelete:'CASCADE' })
    @JoinColumn({name: "sectionId"})
    section: Section;

    @Column()
    sectionId: string;

    @Column()
    sectionName: string;

    @OneToMany(() => Post, (post) => post.topic)
    posts: Post[];

    @Column()
    lastPostUser: string;

    @Column()
    countPostsTopic: number;
}