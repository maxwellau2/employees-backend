process to writing migrations with TypeORM verion ()
step 0:
ensure you have ts-node installed, so that you can 
```run npx ts-node {...}```

step 1: 

ensure that we have defined the datasource as such 
```ts
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Employee } from "../model/Employee.model";
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
    entities: [Employee],
    migrations: ["src/migration/*{.ts,.js}"],
    subscribers: [],
}

export const employeesDataSource = new DataSource({...connectionOptions})
```
to generate a migration automatically, you can run this template:

```
npx ts-node ./node_modules/typeorm/cli.js migration:generate -d {path to data source .ts} {path to migration file.ts}
```
Sample usage
```
npx ts-node ./node_modules/typeorm/cli.js migration:generate -d src/database/Employee.dataSourceDev.ts src/migration/migration2
```

step 2: run the migration
run with the following command
```
npx ts-node ./node_modules/typeorm/cli.js migration:run -d {path to changed data source}
```
sample uage
```
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/database/Employee.dataSourceDev.ts
```
