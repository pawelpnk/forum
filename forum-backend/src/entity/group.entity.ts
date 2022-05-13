import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import User from "./user.entity";

@Entity()
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    updateAt: string;

    @OneToMany(() => Message, (message) => message.group)
    messages: Message[];

    @ManyToMany(() => User, (user) => user.groups, { cascade: true, onDelete:'CASCADE' })
    users: User[];
}