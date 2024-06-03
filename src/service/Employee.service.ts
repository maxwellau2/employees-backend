import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { Employee } from "../model/Employee.model";
import * as dotenv from 'dotenv';
import { employeesDataSource } from "../database/Employee.dataSourceDev"

dotenv.config()
interface EmployeeWindow{
    totalEmployees: number,
    employees: Employee[]
}
export class employeesConnection{

    repository : Repository<Employee>
    datasource: DataSource;
    constructor(repository: Repository<Employee>, datasource: DataSource){
        this.repository = repository
        this.datasource = datasource
    }

    private employeeFactory(name: string, salary:number, department:string) : Employee{
        const new_employee = new Employee();
        new_employee.name = name;
        new_employee.department = department;
        new_employee.salary = salary;
        return new_employee;
    }

    public async getAllEmployees() : Promise<Employee[]>{
        const all_employees = await this.repository.find();
        return all_employees;
    }

    public async createNewEmployee(name: string, salary:number, department:string) : Promise<Employee|null>{
        const new_employee = this.employeeFactory(name, salary, department);
        try{
            await this.repository.save(new_employee);
            return new_employee;
        }
        catch{
            return null;
        }
    }

    public async getEmployeeById(id:number) : Promise<Employee|null>{
        const employee = await this.repository.findOneBy({id})
        return employee;
    }

    public async deleteEmployee(id:number) : Promise<boolean>{
        const employee = await this.getEmployeeById(id);
        if (employee){
            await this.repository.remove(employee);
            return true;
        }
        return false;
    }

    public async updateEmployee(id:number, name: string, salary:number, department:string) : Promise<Employee|null>{
        // await this.repository.update(id, { name, salary, department })
        const target_employee = await this.getEmployeeById(id);
        console.log(target_employee)
        if (target_employee){
            target_employee.name = name;
            target_employee.salary = salary;
            target_employee.department = department;
            const updated_employee = await this.repository.save(target_employee);
            return updated_employee; // updated
        }
        return null; // no updates
    }

    public async getEmployeeWindow(page_number: number, window_size: number): Promise<EmployeeWindow>{
        const start_number = page_number*window_size;
        const all_employees = await this.getAllEmployees();
        if (all_employees.length <= start_number){
            return null; // window of employees DNE
        }
        else if (all_employees.length <= start_number + window_size){
            // return until end
            return {employees: all_employees.slice(start_number, all_employees.length), totalEmployees: all_employees.length}
        }
        return { employees: all_employees.slice(start_number, start_number+window_size), totalEmployees: all_employees.length}
    };
}

