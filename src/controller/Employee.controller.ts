import { Request, Response } from "express";
import { employeesConnection } from "../service/Employee.service";
import { AuthenticatedRequest } from "../middleware/Authentication.middleware";

export const getAllEmployeesController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        console.log(req.user);
        const employees = await connection.getAllEmployees();
        return res.status(200).send(employees);
    };

export const createNewEmployeeController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        // console.log(req.body);
        const body = req.body;
        console.log(body);

        const resultant_employee = await connection.createNewEmployee(
            body.name,
            body.salary,
            body.department
        );
        console.log(await connection.getAllEmployees());
        return res
            .status(200)
            .json({ status: "success", data: resultant_employee });
    };

export const getEmployeeByIdController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        const employee = await connection.getEmployeeById(
            parseInt(req.params.emp_id, 10)
        );
        if (employee) {
            return res.status(200).send(employee);
        }
        return res.status(404).send("Employee Not Found");
    };

export const getEmployeeWindowController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        const pageNumber = parseInt(req.query.pageNumber as string, 10);
        const windowSize = parseInt(req.query.windowSize as string, 10);
        console.log(req.user);
        let employees = await connection.getEmployeeWindow(
            pageNumber,
            windowSize,
            req.user.departmentId
        );
        if (employees) {
            return res.status(200).send(employees);
        }
        // employees is null
        return res.status(404).json({
            message: "window size exceeded",
            data: [],
            totalEmployees: 0,
        });
    };

export const updateEmployeeController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        const emp_id = parseInt(req.params.emp_id, 10);
        const original_employee = await connection.getEmployeeById(emp_id);
        const { name, salary, department } = req.body;
        const updated_employee = await connection.updateEmployee(
            emp_id,
            name,
            Number(salary),
            department
        );
        if (updated_employee) {
            if (updated_employee == original_employee) {
                return res.status(304).send("no change");
            }
            return res
                .status(200)
                .json({ status: "success", data: updated_employee });
        }
        return res.status(404).send("bad request");
    };

export const deleteEmployeeController =
    (connection: employeesConnection) =>
    async (req: AuthenticatedRequest, res: Response) => {
        const result = await connection.deleteEmployee(
            parseInt(req.params.emp_id, 10)
        );
        console.log(result);
        if (result) {
            console.log("Deleted Employee");
            return res.status(200).json({ message: "successful operation" });
        }
        return res.status(404).json({ message: "bad request" });
    };
