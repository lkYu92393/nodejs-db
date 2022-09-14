import express, { Request, Response } from "express";
import { GetColumns, GetAllData, CreateNewTable, AddDataToTable } from "../database";

const router = express.Router();

router.get("/me", (req: Request, res: Response) => {
    GetAllData("user").then((data: any) => {
        const meData = data.filter((i: Record<string, any>) => i.email == req.headers.authorization);
        // const result = {
        //     OK: meData? true : false,
        //     DATA: meData? meData : []
        // };
        if (meData.length > 0) {
            const result = {
                jwt: meData[0].email,
                user: {
                    email: meData[0].email,
                    name: meData[0].name
                }
            }
            res.json(result);
        } else {
            res.json({OK:false, msg: "No user found."})
        }
    })
    .catch((err: any) => { 
        const result = {
            OK: false,
            msg: err
        }
        res.status(200).send(result); 
    });
});
router.post("/login", (req: Request, res: Response) => {
    GetAllData("user").then((data: any) => {
        const meData = data.filter((i: any) => i.email == req.body.email);
        // const result = {
        //     OK: meData? true : false,
        //     DATA: meData? meData : []
        // };
        if (meData.length > 0) {
            const result = {
                jwt: meData[0].email,
                user: {
                    email: meData[0].email,
                    name: meData[0].name
                }
            }
            res.json(result);
        } else {
            res.json({OK:false, msg: "No user found."})
        }
    });
});
router.post("/register", (req: Request, res: Response) => {
    const userData: Record<string, any> = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        createdAt: (new Date().valueOf()).toString(),
    };
    const userDataObj: string[] = Object.keys(userData).map(key => userData[key]);
    AddDataToTable("user", userDataObj);
    res.json({
        jwt: userData.email,
        user: {
            email: userData.email,
            name: userData.name
        }
    });
});

export default router;