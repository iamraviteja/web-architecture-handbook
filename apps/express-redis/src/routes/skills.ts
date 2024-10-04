import express, { type Request } from "express";
import getRedisClient from "../utils/redisclient";
import {
  skillsSetKey,
  usersBySkillKey,
} from "../utils/rediskeys";
import { errorResponse, successResponse } from "../utils/responses";

const router = express.Router();

router.get("/", async (req: Request, res, next) => {
  // TODO: move code to seperate function and create dependency injection
  try {
    const client = await getRedisClient();
    const key = skillsSetKey()
    const results = await client.SMEMBERS(key)
    successResponse(
      res,
      results,
      "get skills"
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res, next) => {
  let id: string | null = req.params.id;
  // TODO: move code to seperate function and create dependency injection
  try {
    const client = await getRedisClient();
    const key = usersBySkillKey(`${id}`);
    const results = await client.SMEMBERS(key)
    successResponse(
      res,
      results,
      "get users by skill"
    );
  } catch (error) {
    next(error);
  }
});

export default router;
