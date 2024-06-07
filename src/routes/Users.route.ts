import { Router } from "express";
import {
  createUserController,
  loginController,
} from "../controller/Users.controller";
import { usersService } from "../service/Users.service";
import { validateLogin, validateNewUser } from "../middleware/Users.middleware";

const createUsersRouter = (connection: usersService) => {
  const authRouter = Router();

  authRouter.post(
    "/createUser",
    validateNewUser,
    createUserController(connection)
  );

  authRouter.post("/login", validateLogin, loginController(connection));

  return authRouter;
};

export default createUsersRouter;
