import type { Response } from "express";

export function successResponse(
  res: Response,
  data: any,
  message: string = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  status: number = 500,
  data: any,
  message: string = "Error"
) {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
}
