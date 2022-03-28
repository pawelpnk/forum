import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    topic: string

    @CreateDateColumn()
    createdAT: Date

    @UpdateDateColumn()
    updatedAt: Date
}