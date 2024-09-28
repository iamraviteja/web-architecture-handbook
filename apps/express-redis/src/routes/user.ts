import express from "express";
import { validate } from "../middlewares/validate";
import { UserSchema, type User } from "../schemas/user";

const router = express.Router();

router.get("/", async (req, res) => {
    res.send({ messsage: "get user!!"});
})

router.post("/", validate(UserSchema), async (req, res) => {
    let body = req.body as User;
    res.send({ message: 'post user!!', user: body});
})

export default router;