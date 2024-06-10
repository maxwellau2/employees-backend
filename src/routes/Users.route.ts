import { Router } from "express";
import {
    createUserController,
    loginController,
    logoutController,
} from "../controller/Users.controller";
import { usersService } from "../service/Users.service";
import { validateLogin, validateNewUser } from "../middleware/Users.middleware";

const createUsersRouter = (connection: usersService) => {
    const authRouter = Router();

    authRouter.post(
        "/signup",
        validateNewUser,
        createUserController(connection)
    );

    authRouter.post("/login", validateLogin, loginController(connection));

    authRouter.post("/logout", logoutController);

    return authRouter;
};

export default createUsersRouter;
