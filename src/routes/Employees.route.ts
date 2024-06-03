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
    const employeeRouter = Router();
    
    employeeRouter.post("/employee", validateEmployee, createNewEmployeeController(connection))
    
    employeeRouter.get("/employee", getAllEmployeesController(connection))
    
    employeeRouter.get("/employee/:emp_id", getEmployeeByIdController(connection))
    
    employeeRouter.get("/employees", validateWindow, getEmployeeWindowController(connection))
    
    employeeRouter.put("/employee/:emp_id", validateEmployee, updateEmployeeController(connection))
    
    employeeRouter.delete("/employee/:emp_id",deleteEmployeeController(connection))
    
    
    return employeeRouter
}

export default createEmployeeRouter