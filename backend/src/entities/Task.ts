import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: "Pending" })
    status: string;

    @Column()
    assignedTo: number;

    @Column()
    createdBy: number;

    @CreateDateColumn()
    createdAt: Date;
}