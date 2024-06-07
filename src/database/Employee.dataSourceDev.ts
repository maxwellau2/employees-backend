import "reflect-metadata"
import { DataSource } from "typeorm"
import { Employee } from "../model/Employee.model";
import { User } from "../model/Users.model";
import { DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config()

// console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME)

const connectionOptions : DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Employee, User],
    migrations: ["src/migration/*{.ts,.js}"],
    subscribers: [],
}

export const employeesDataSource = new DataSource({...connectionOptions})
