import express, { type Request } from "express";
import getRedisClient from "../utils/redisclient";
import { fakePostsKey, fakeUsersKey } from "../utils/rediskeys";
import { errorResponse, successResponse } from "../utils/responses";

const router = express.Router();

// Example of cache aside pattern
// fake post details
router.get("/:id/post", async (req: Request<{ id: string }>, res, next) => {
  let id: string | null = req.params.id;
  try {
    let data;
    const client = await getRedisClient();
    let cachedData = await client.GET(fakePostsKey(id));

    if (!cachedData) {
      data = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      ).then((r) => r.json());
      await client.SET(fakePostsKey(id), JSON.stringify(data));
    } else {
      data = JSON.parse(cachedData);
    }

    successResponse(res, data, "get fake user details");
  } catch (error) {
    next(error);
  }
});

// Example of cache aside pattern
// fake user details
router.get("/:id/user", async (req: Request<{ id: string }>, res, next) => {
  let id: string | null = req.params.id;
  try {
    let data;
    const client = await getRedisClient();
    let cachedData = await client.json.get(fakeUsersKey(id));

    if (!cachedData) {
      data = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      ).then((r) => r.json());
      await client.json.set(fakeUsersKey(id), ".", data as any);
    } else {
      data = cachedData;
    }

    successResponse(res, data, "get fake user details");
  } catch (error) {
    next(error);
  }
});

export default router;
