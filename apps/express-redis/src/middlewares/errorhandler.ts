import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";


export function errorHandler(req: Request, res: Response, next: NextFunction) {
    if(!req.route){
        errorResponse(res, 404, 'route you are looking for is not present!!');
    }
    errorResponse(res, 500, 'something is wrong please check!!');
}