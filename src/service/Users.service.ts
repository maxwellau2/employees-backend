import { DataSource, Repository } from "typeorm";
import { User } from "../model/Users.model";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export enum Timeouts {
    short = "30s",
    medium = "5m",
    long = "15m",
}

export class usersService {
    repository: Repository<User>;
    datasource: DataSource;

    constructor(repository: Repository<User>, datasource: DataSource) {
        this.repository = repository;
        this.datasource = datasource;
    }

    private userFactory(
        username: string,
        password: string,
        departmentId: number
    ) {
        const newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.departmentId = departmentId;
        return newUser;
    }

    private hashPassword(password: string) {
        const salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(password, salt);
    }

    public async createUser(
        username: string,
        password: string,
        departmentId: number
    ) {
        const foundUser = await this.repository.findOne({
            where: {
                username: username,
            },
        });
        console.log(foundUser);
        if (foundUser) {
            console.log("username exists");
            return null;
        }
        const newUser = this.userFactory(
            username,
            this.hashPassword(password),
            departmentId
        );
        try {
            await this.repository.save(newUser);
            return newUser;
        } catch {
            console.log("error has occured");
            return null;
        }
    }

    public async login(username: string, password: string, timeout: Timeouts) {
        let user = await this.repository.findOne({
            where: {
                username: username,
            },
        });
        // check if user exists
        if (!user) {
            console.log("Invalid Username");
            return null;
        }
        // check password
        if (!bcrypt.compareSync(password, user.password)) {
            console.log("Wrong password");
            return null;
        }
        // sign using jwt
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                departmentId: user.departmentId,
            },
            SECRET_KEY,
            { expiresIn: timeout }
        );
        return token;
    }
}

// async function main() {
//   await employeesDataSource.initialize();
//   const employeesRepository = employeesDataSource.getRepository(User);
//   const connection = new usersService(employeesRepository, employeesDataSource);
//   //   console.log(connection);
//     console.log(await connection.createUser("maxwellau1", "12345", 1));
//   console.log(await connection.login("maxwellau1", "12345", Timeouts.short));
// }

// main();
