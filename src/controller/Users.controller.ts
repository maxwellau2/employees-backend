import { Request, Response } from "express";
import { usersService, Timeouts } from "../service/Users.service";

export const createUserController =
    (connection: usersService) => async (req: Request, res: Response) => {
        // assuming body is already validated
        const body = req.body;
        console.log(body);
        const newUser = await connection.createUser(
            body.username,
            body.password,
            body.departmentId
        );
        if (!newUser)
            return res
                .status(200)
                .json({ status: "failed", message: "username already exists" });
        return res
            .status(200)
            .json({ status: "success", message: "successfully created" });
    };

export const loginController =
    (connection: usersService) => async (req: Request, res: Response) => {
        const body = req.body;
        const jwtToken = await connection.login(
            body.username,
            body.password,
            Timeouts.long
        );
        if (!jwtToken)
            return res
                .status(400)
                .json({ status: "failed", message: "wrong username/password" });
        // res.cookie("token", jwtToken, { httpOnly: true });
        // redirect using
        // res.redirect("/welcome");
        return res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json({ status: "success", user: jwtToken });
        //   .redirect("/welcome");
    };

export const logoutController = async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json({ status: "succes", message: "logged out" });
};
