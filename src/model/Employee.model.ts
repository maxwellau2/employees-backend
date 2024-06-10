import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "float" })
    salary: number;

    @Column()
    department: string;

    @Column()
    departmentId: number;
}
