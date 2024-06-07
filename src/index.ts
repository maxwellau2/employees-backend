import { employeesConnection } from "./service/Employee.service";
import express, { Request, Response, NextFunction } from "express";
import createEmployeeRouter from "./routes/Employees.route";
import cors from "cors";
import { employeesDataSource } from "./database/Employee.dataSourceDev";
import { Employee } from "./model/Employee.model";
import { User } from "./model/Users.model";
import { usersService } from "./service/Users.service";
import cookieParser from "cookie-parser";
import createUsersRouter from "./routes/Users.route";

async function main() {
  let whitelist = ["http://localhost:5173"];

  // initializing DB
  await employeesDataSource.initialize();
  const employeesRepository = employeesDataSource.getRepository(Employee);
  const usersRepository = employeesDataSource.getRepository(User);
  const employeesConnector = new employeesConnection(
    employeesRepository,
    employeesDataSource
  );
  const usersConnector = new usersService(usersRepository, employeesDataSource);

  const app = express();

  // using cors and json, can add more middleware here
  // cors options
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());

  // base GET request
  app.get("/", (req: Request, res: Response) => {
    console.log(req);
    return res.send("hiii world");
  });

  // adding routes
  const employeeRouter = createEmployeeRouter(employeesConnector);
  const usersRouter = createUsersRouter(usersConnector);
  app.use("/api", employeeRouter);
  app.use("/users", usersRouter);

  app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}

main();
