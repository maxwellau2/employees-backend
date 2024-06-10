import "reflect-metadata";
import { DataSource, Repository } from "typeorm";
import { Employee } from "../model/Employee.model";
import * as dotenv from "dotenv";

dotenv.config();

interface EmployeeWindow {
    totalEmployees: number;
    employees: Employee[];
}
export class employeesConnection {
    departmentToId = {
        HR: 1,
        PS: 2,
    };
    repository: Repository<Employee>;
    datasource: DataSource;
    constructor(repository: Repository<Employee>, datasource: DataSource) {
        this.repository = repository;
        this.datasource = datasource;
    }

    private employeeFactory(
        name: string,
        salary: number,
        department: string
    ): Employee {
        const new_employee = new Employee();
        new_employee.name = name;
        new_employee.department = department;
        new_employee.departmentId = this.departmentToId[department];
        new_employee.salary = salary;
        return new_employee;
    }

    public async getAllEmployees(): Promise<Employee[]> {
        const all_employees = await this.repository.find();
        return all_employees;
    }

    public async getFilteredEmployees(
        departmentId: number
    ): Promise<Employee[]> {
        const all_employees = await this.repository.find({
            where: { departmentId: departmentId },
        });
        return all_employees;
    }

    public async createNewEmployee(
        name: string,
        salary: number,
        department: string
    ): Promise<Employee | null> {
        const new_employee = this.employeeFactory(name, salary, department);
        console.log(new_employee);
        try {
            await this.repository.save(new_employee);
            return new_employee;
        } catch {
            return null;
        }
    }

    public async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.repository.findOneBy({ id });
        return employee;
    }

    public async deleteEmployee(id: number): Promise<boolean> {
        const employee = await this.getEmployeeById(id);
        if (employee) {
            await this.repository.remove(employee);
            return true;
        }
        return false;
    }

    public async updateEmployee(
        id: number,
        name: string,
        salary: number,
        department: string
    ): Promise<Employee | null> {
        // await this.repository.update(id, { name, salary, department })
        const target_employee = await this.getEmployeeById(id);
        console.log(target_employee);
        if (target_employee) {
            target_employee.name = name;
            target_employee.salary = salary;
            target_employee.department = department;
            target_employee.departmentId = this.departmentToId[department];
            const updated_employee = await this.repository.save(
                target_employee
            );
            return updated_employee; // updated
        }
        return null; // no updates
    }

    public async getEmployeeWindow(
        page_number: number,
        window_size: number,
        access: number
    ): Promise<EmployeeWindow> {
        console.log(access);
        const start_number = page_number * window_size;
        let all_employees = null;
        if (access === 3) {
            all_employees = await this.getAllEmployees();
        } else all_employees = await this.getFilteredEmployees(access);
        if (all_employees.length <= start_number) {
            return { employees: [], totalEmployees: all_employees.length }; // window of employees DNE
        } else if (all_employees.length <= start_number + window_size) {
            // return until end
            return {
                employees: all_employees.slice(
                    start_number,
                    all_employees.length
                ),
                totalEmployees: all_employees.length,
            };
        }
        return {
            employees: all_employees.slice(
                start_number,
                start_number + window_size
            ),
            totalEmployees: all_employees.length,
        };
    }
}
