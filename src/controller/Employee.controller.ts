import { Request, Response } from "express";
import { DbConnection } from "../service/Employee.service";

export const GetAllEmployeesController = (connection:DbConnection) =>  async (req:Request, res:Response) =>{
    const employees = await connection.GetAllEmployees();
    return res.status(200).send(employees)
}

export const CreateNewEmployeeController = (connection:DbConnection) => async (req:Request, res:Response)=>{
    // console.log(req.body);
    const body = req.body;
    console.log(body);
    
    const resultant_employee = await connection.CreateNewEmployee(body.name, body.salary, body.department);
    console.log(connection.GetAllEmployees())
    return res.status(200).json({status:"success", data:resultant_employee});
}

export const GetEmployeeByIdController = (connection:DbConnection) => (connection:DbConnection) => async (req:Request, res:Response) =>{
    const employee = await connection.GetEmployeeById(parseInt(req.params.emp_id, 10));
    if (employee){
        return res.status(200).send(employee);    
    }
    return res.status(404).send("Employee Not Found");
}

export const GetEmployeeWindowController = (connection:DbConnection) => async (req: Request, res: Response) => {
    const start = parseInt(req.query.start as string, 10);
    const windowSize = parseInt(req.query.windowSize as string, 10);
    let employees = await connection.GetEmployeeWindow(start, windowSize);
    if (employees) {
        return res.status(200).send(employees);
    }
    // employees is null
    return res.status(404).json({ "message": "window size exceeded" });
}

export const UpdateEmployeeController = (connection:DbConnection) =>  async (req:Request, res:Response)=>{
    const emp_id = parseInt(req.params.emp_id, 10);
    const original_employee = await connection.GetEmployeeById(emp_id);
    const { name, salary, department } = req.body;
    const updated_employee = await connection.UpdateEmployee(emp_id, name, Number(salary), department);
    if (updated_employee){
        if (updated_employee == original_employee){
            return res.status(304).send("no change");
        }
        return res.status(200).json({status: "success", data:updated_employee}); 
    }
    return res.status(404).send("bad request");
}

export const DeleteEmployeeController = (connection:DbConnection) => async (req:Request, res:Response)=>{
    const result = await connection.DeleteEmployee(parseInt(req.params.emp_id, 10))
    console.log(result)
    if (result){
        console.log("hiii bitchh")
        return res.status(200).json({message:"successful operation"});
    }
    return res.status(404).json({message:"bad request"});
}
