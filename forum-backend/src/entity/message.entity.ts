import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import User from "./user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column()
    author: string;

    @ManyToOne(() => Group, (group) => group.messages)
    group: Group;
}