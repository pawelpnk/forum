import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Topic } from "./topic.entity";

@Entity()
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sectionName: string;

    @OneToMany(() => Topic, (topic) => topic.section)
    topics: Topic[];
}