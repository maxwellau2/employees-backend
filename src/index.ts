import { employeesConnection } from "./service/Employee.service"
import express, {Request,Response,NextFunction} from "express";
import createEmployeeRouter from "./routes/Employees.route";
import cors from "cors"
import { employeesDataSource } from "./database/Employee.dataSourceDev";
import { Employee } from "./model/Employee.model";

async function main(){
    let whitelist = ['http://localhost:5173']
    
    // initializing DB
    await employeesDataSource.initialize()
    const employeesRepository = employeesDataSource.getRepository(Employee)
    const connection = new employeesConnection(employeesRepository, employeesDataSource);

    const app = express();
    
    // using cors and json, can add more middleware here
    app.use(cors({origin:whitelist}))
    app.use(express.json());
    
    // base GET request
    app.get("/", (req:Request,res:Response) =>{
        console.log(req);
        return res.send("hiii world");
    })
    
    // adding routes
    const employeeRouter = createEmployeeRouter(connection);
    app.use(employeeRouter)

    app.listen(3000, ()=>{
        console.log("Listening on http://localhost:3000");
    })
}

main();