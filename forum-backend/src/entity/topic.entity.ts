import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { Section } from "./section.entity";
import User from "./user.entity";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    topic: string

    @Column()
    createdAt: string

    @Column()
    updatedAt: string

    @ManyToOne(() => User, (user) => user.topics)
    @JoinColumn({name: "userId"})
    user: User

    @Column({nullable: false})
    userId: string

    @ManyToOne(() => Section, (section) => section.topics)
    @JoinColumn({name: "sectionId"})
    section: Section

    @Column({nullable: false})
    sectionId: string

    @OneToMany(() => Post, (post) => post.topic)
    posts: Post[]
}