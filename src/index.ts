import { AppDataSource } from "./database/Employee.data-source"
import { Employee } from "./model/Employee.model"
import { DbConnection } from "./service/Employee.service"
import { validateEmployee, validateWindow } from "./middleware/Employee.middleware";
import express, {Request,Response,NextFunction} from "express";
import createEmployeeRouter from "./routes/Employees.route";
import cors from "cors"
import { exit } from "process";

async function main(){
    let whitelist = ['http://localhost:5173']
    const connection = new DbConnection();
    try{
        await connection.initialize();
    }
    catch{
        console.log("an error has occured")
        return;
    }
    const employee_router = createEmployeeRouter(connection);
    const app = express();
    app.use(cors({origin:whitelist}))
    app.use(express.json());

    app.get("/", (req:Request,res:Response) =>{
        console.log(req);
        return res.send("hiii world");
    })

    app.use(employee_router)

    app.listen(3000, ()=>{
        console.log("Listening on http://localhost:3000");
    })
}

main();