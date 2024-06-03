# Express + TypeORM 

Steps to run this project:

1. Run `npm i` command
2. Create the psql data base called "employees.db", configure the datasource parameters (username, password, db name...) as found in "src/database/Employee.dataSourceDev.ts" 
3. Start the migration thru CLI
```
npx ts-node ./node_modules/typeorm/cli.js migration:generate -d src/database/Employee.dataSourceDev.ts src/migration/migration2
```'
Note that the initial migration will only create the an empty employee table
4. Run `npm start` command
