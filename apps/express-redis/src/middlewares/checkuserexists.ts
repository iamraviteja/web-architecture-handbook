import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";
import getRedisClient from "../utils/redisclient";
import { userKeyById } from "../utils/rediskeys";


export async function checkUserExists(req: Request, res: Response, next: NextFunction) {
    if(!req.params.id){
        errorResponse(res, 400, 'Bad Request no id found');
    }

    try {
        const client = await getRedisClient();
        const key = userKeyById(`${req.params.id}`);
        const resId = await client.HGET(key, 'id');
        if(!resId){
            errorResponse(res, 404, 'No resource found!!');
        }
        next();
    } catch (error) {
        errorResponse(res, 500, 'something is wrong please check!!');
    }
}