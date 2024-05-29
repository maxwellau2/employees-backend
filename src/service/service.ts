import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { Employee } from "../entity/Employee";
import * as dotenv from 'dotenv';
import { AppDataSource } from "../service/data-source"

dotenv.config()
export class DbConnection{
    datasource: DataSource;
    repository: Repository<Employee>;
    constructor(){
        this.datasource = AppDataSource;
        // this.initialize();
    }
    public async initialize(){
        await this.datasource.initialize().then(async () => {
            console.log("Db Initialized!");
            this.repository = this.datasource.getRepository(Employee); 
        }).catch(error => console.log(error))
    }

    private EmployeeFactory(name: string, salary:number, department:string) : Employee{
        let new_employee = new Employee();
        new_employee.name = name;
        new_employee.department = department;
        new_employee.salary = salary;
        return new_employee;
    }

    public async GetAllEmployees() : Promise<Employee[]>{
        let all_employees = await this.repository.find();
        return all_employees;
    }

    public async CreateNewEmployee(name: string, salary:number, department:string) : Promise<Employee|null>{
        let new_employee = this.EmployeeFactory(name, salary, department);
        try{
            await this.repository.save(new_employee);
            return new_employee;
        }
        catch{
            return null;
        }
    }

    public async GetEmployeeById(id:number) : Promise<Employee|null>{
        let employee = await this.repository.findOneBy({id})
        return employee;
    }

    public async DeleteEmployee(id:number) : Promise<boolean>{
        let employee = await this.GetEmployeeById(id);
        if (employee){
            await this.repository.remove(employee);
            return true;
        }
        return false;
    }

    public async UpdateEmployee(id:number, name: string, salary:number, department:string) : Promise<Employee|null>{
        // await this.repository.update(id, { name, salary, department })
        let target_employee = await this.GetEmployeeById(id);
        console.log(target_employee)
        if (target_employee){
            target_employee.name = name;
            target_employee.salary = salary;
            target_employee.department = department;
            let updated_employee = await this.repository.save(target_employee);
            return updated_employee; // updated
        }
        return null; // no updates
    }

    public async GetEmployeeWindow(start_number: number, window_size: number){
        let all_employees = await this.GetAllEmployees();
        if (all_employees.length <= start_number){
            return null; // window of employees DNE
        }
        else if (all_employees.length <= start_number + window_size){
            // return until end
            return all_employees.slice(start_number, all_employees.length-1);
        }
        return all_employees.slice(start_number, start_number+window_size);
    }
}

