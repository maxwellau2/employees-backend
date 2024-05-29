import { AppDataSource } from "./service/data-source"
import { Employee } from "./entity/Employee"
import { DbConnection } from "./service/service"
import { validateEmployee, validateWindow } from "./middleware/middleware";
import express, {Request,Response,NextFunction} from "express";
import cors from "cors"

async function main(){
    let connection = new DbConnection()
    await connection.initialize();
    let whitelist = ['http://localhost:5173', 'http://example2.com']
    const app = express();
    app.use(cors({origin:whitelist}))
    app.use(express.json());

    app.get("/", (req:Request,res:Response) =>{
        console.log(req);
        return res.send("hiii world");
    })

    app.post("/employee", validateEmployee, async (req:Request, res:Response)=>{
        // console.log(req.body);
        let body = req.body;
        console.log(body);
        
        let resultant_employee = await connection.CreateNewEmployee(body.name, body.salary, body.department);
        console.log(connection.GetAllEmployees())
        return res.status(200).json({status:"success", data:resultant_employee});
    })

    app.get("/employee", async (req:Request, res:Response) =>{
        let employees = await connection.GetAllEmployees();
        return res.status(200).send(employees)
    })

    app.get("/employee/:emp_id", async (req:Request, res:Response) =>{
        let employee = await connection.GetEmployeeById(parseInt(req.params.emp_id, 10));
        if (employee){
            return res.status(200).send(employee);    
        }
        return res.status(404).send("Employee Not Found");
    })

    app.get("/employees", validateWindow, async (req: Request, res: Response) => {
        const start = parseInt(req.query.start as string, 10);
        const windowSize = parseInt(req.query.windowSize as string, 10);
        let employees = await connection.GetEmployeeWindow(start, windowSize);
        if (employees) {
            return res.status(200).send(employees);
        }
        // employees is null
        return res.status(404).json({ "message": "window size exceeded" });
    })

    app.put("/employee/:emp_id", validateEmployee, async (req:Request, res:Response)=>{
        let emp_id = parseInt(req.params.emp_id, 10);
        let original_employee = await connection.GetEmployeeById(emp_id);
        let { name, salary, department } = req.body;
        let updated_employee = await connection.UpdateEmployee(emp_id, name, Number(salary), department);
        if (updated_employee){
            if (updated_employee == original_employee){
                return res.status(304).send("no change");
            }
            return res.status(200).send("successful operation"); 
        }
        return res.status(404).send("bad request");
    })

    app.delete("/employee/:emp_id", async (req:Request, res:Response)=>{
        let result = await connection.DeleteEmployee(parseInt(req.params.emp_id, 10))
        console.log(result)
        if (result){
            console.log("hiii bitchh")
            return res.status(200).json({message:"successful operation"});
        }
        return res.status(404).json({message:"bad request"});
    })

    app.listen(3000, ()=>{
        console.log("Listening on http://localhost:3000");
    })
}

main();