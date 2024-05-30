import { Express, Request, Response, Router } from "express";
import { validateEmployee, validateWindow } from "../middleware/Employee.middleware";
import { DbConnection } from "../service/Employee.service";


const createEmployeeRouter = (connection: DbConnection)=>{
    const employee_router = Router();
    
    employee_router.post("/employee", validateEmployee, async (req:Request, res:Response)=>{
        // console.log(req.body);
        let body = req.body;
        console.log(body);
        
        let resultant_employee = await connection.CreateNewEmployee(body.name, body.salary, body.department);
        console.log(connection.GetAllEmployees())
        return res.status(200).json({status:"success", data:resultant_employee});
    })
    
    employee_router.get("/employee", async (req:Request, res:Response) =>{
        let employees = await connection.GetAllEmployees();
        return res.status(200).send(employees)
    })
    
    employee_router.get("/employee/:emp_id", async (req:Request, res:Response) =>{
        let employee = await connection.GetEmployeeById(parseInt(req.params.emp_id, 10));
        if (employee){
            return res.status(200).send(employee);    
        }
        return res.status(404).send("Employee Not Found");
    })
    
    employee_router.get("/employees", validateWindow, async (req: Request, res: Response) => {
        const start = parseInt(req.query.start as string, 10);
        const windowSize = parseInt(req.query.windowSize as string, 10);
        let employees = await connection.GetEmployeeWindow(start, windowSize);
        if (employees) {
            return res.status(200).send(employees);
        }
        // employees is null
        return res.status(404).json({ "message": "window size exceeded" });
    })
    
    employee_router.put("/employee/:emp_id", validateEmployee, async (req:Request, res:Response)=>{
        let emp_id = parseInt(req.params.emp_id, 10);
        let original_employee = await connection.GetEmployeeById(emp_id);
        let { name, salary, department } = req.body;
        let updated_employee = await connection.UpdateEmployee(emp_id, name, Number(salary), department);
        if (updated_employee){
            if (updated_employee == original_employee){
                return res.status(304).send("no change");
            }
            return res.status(200).json({status: "success", data:updated_employee}); 
        }
        return res.status(404).send("bad request");
    })
    
    employee_router.delete("/employee/:emp_id", async (req:Request, res:Response)=>{
        let result = await connection.DeleteEmployee(parseInt(req.params.emp_id, 10))
        console.log(result)
        if (result){
            console.log("hiii bitchh")
            return res.status(200).json({message:"successful operation"});
        }
        return res.status(404).json({message:"bad request"});
    })
    
    
    return employee_router
}

export default createEmployeeRouter