import "reflect-metadata"
import { DataSource } from "typeorm"
import { Employee } from "../model/Employee.model";
import { DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config()

// usually we should use production keys and stuff, to be read here, but in this case we just use the same
// params as dev env

const connectionOptions : DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/model/*.model.{ts,js}"],
    migrations: ["src/migration/*{.ts,.js}"],
    subscribers: [],
}

export const employeesDataSource = new DataSource({...connectionOptions})
