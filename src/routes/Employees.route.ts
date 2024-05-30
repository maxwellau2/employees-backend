import { Express, Request, Response, Router } from "express";
import { validateEmployee, validateWindow } from "../middleware/Employee.middleware";
import { DbConnection } from "../service/Employee.service";
import {
    GetAllEmployeesController,
    GetEmployeeWindowController,
    CreateNewEmployeeController,
    GetEmployeeByIdController,
    UpdateEmployeeController,
    DeleteEmployeeController
} from "../controller/Employee.controller";

const createEmployeeRouter = (connection: DbConnection)=>{
    const employee_router = Router();
    
    employee_router.post("/employee", validateEmployee, CreateNewEmployeeController(connection))
    
    employee_router.get("/employee", GetAllEmployeesController(connection))
    
    employee_router.get("/employee/:emp_id", GetEmployeeByIdController(connection))
    
    employee_router.get("/employees", validateWindow, GetEmployeeWindowController(connection))
    
    employee_router.put("/employee/:emp_id", validateEmployee, UpdateEmployeeController(connection))
    
    employee_router.delete("/employee/:emp_id",DeleteEmployeeController(connection))
    
    
    return employee_router
}

export default createEmployeeRouter