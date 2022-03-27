import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Section {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    sectionName: string;
}