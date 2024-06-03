import { Express, Request, Response, Router } from "express";
import { validateEmployee, validateWindow } from "../middleware/Employee.middleware";
import { employeesConnection } from "../service/Employee.service";
import {
    getAllEmployeesController,
    getEmployeeWindowController,
    createNewEmployeeController,
    getEmployeeByIdController,
    updateEmployeeController,
    deleteEmployeeController
} from "../controller/Employee.controller";

const createEmployeeRouter = (connection: employeesConnection)=>{
    const employee_router = Router();
    
    employee_router.post("/employee", validateEmployee, createNewEmployeeController(connection))
    
    employee_router.get("/employee", getAllEmployeesController(connection))
    
    employee_router.get("/employee/:emp_id", getEmployeeByIdController(connection))
    
    employee_router.get("/employees", validateWindow, getEmployeeWindowController(connection))
    
    employee_router.put("/employee/:emp_id", validateEmployee, updateEmployeeController(connection))
    
    employee_router.delete("/employee/:emp_id",deleteEmployeeController(connection))
    
    
    return employee_router
}

export default createEmployeeRouter