import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sectionName: string;
}