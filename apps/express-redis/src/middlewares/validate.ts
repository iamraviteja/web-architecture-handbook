import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";
import type { ZodSchema } from "zod";


export function validate<T>(schema: ZodSchema<T>) {
    return function(req: Request, res: Response, next: NextFunction):void {
        const result = schema.safeParse(req.body);
        if(!result.success){
            errorResponse(res, 400, result.error.errors);
        }
        next();
    }
}