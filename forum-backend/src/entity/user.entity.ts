import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    role: string;

    @Column()
    active: boolean;

    @Column({
        type: 'timestamp with time zone',
       default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column()
    image: string;
}