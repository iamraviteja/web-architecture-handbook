import express, { type Response, type Request } from "express";
import { validate } from "../middlewares/validate";
import { UserSchema, type User } from "../schemas/user";
import getRedisClient from "../utils/redisclient";
import {
  fakeUsersKey,
  reviewDetailsKeyById,
  reviewKeyById,
  skillsByUserKey,
  skillsSetKey,
  userKeyById,
  usersByRatingKey,
  usersBySkillKey,
} from "../utils/rediskeys";
import { errorResponse, successResponse } from "../utils/responses";
import { ReviewSchema, type Review } from "../schemas/review";
import { checkUserExists } from "../middlewares/checkuserexists";

const router = express.Router();

router.get("/", async (req: Request, res, next) => {
  let { page = 1, limit = 3 } = req.query;
  let start = (Number(page) - 1)*Number(limit);
  let end = start + Number(limit);
  // TODO: move code to seperate function and create dependency injection
  try {
    const client = await getRedisClient();
    const users = await client.ZRANGE(usersByRatingKey(), start, end);
    const userNames = await Promise.all(users.map((userId:string) => client.HGET(userKeyById(userId), 'name')));
    successResponse(res, userNames, "get users by rating");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res, next) => {
  let id: string | null = req.params.id;
  // TODO: move code to seperate function and create dependency injection
  try {
    const client = await getRedisClient();
    const key = userKeyById(`${id}`);
    const [viewCount, result, skills] = await Promise.all([
      client.HINCRBY(key, "viewCount", 1),
      client.HGETALL(key),
      client.SMEMBERS(skillsByUserKey(`${id}`))
    ]);
    successResponse(res, { result: Object.assign({}, result, {skills}), viewCount }, "get user");
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(UserSchema), async (req, res, next) => {
  let body = req.body as User;
  // TODO: move code to seperate function and create dependency injection
  try {
    const client = await getRedisClient();
    // TODO: change to nanoid
    const id = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    const key = userKeyById(`${id}`);
    const hashData = { id, name: body.name, designation: body.designation };
    if(body.skills && body.skills.length > 0){
      const allSkills: string = skillsSetKey();
      const skillsInUser = skillsByUserKey(`${id}`);
      const result = await Promise.all([
        Promise.all(body.skills.map((skill:string) => client.SADD(allSkills, skill))),
        Promise.all(body.skills.map((skill:string) => client.SADD(skillsInUser, skill))),
        Promise.all(body.skills.map((skill:string) => client.SADD(usersBySkillKey(skill), `${id}`))),
        client.HSET(key, hashData),
        client.ZADD(usersByRatingKey(), { score: 0, value: `${id}`})
      ])
    }else {
      const result = await Promise.all([
        client.HSET(key, hashData),
        client.ZADD(usersByRatingKey(), { score: 0, value: `${id}`})
      ]);
    }
    successResponse(res, Object.assign({}, hashData, { skills: body.skills}), "added user");
  } catch (error) {
    next(error);
  }
});

router.get(
    "/:id/reviews",
    checkUserExists,
    async (req, res, next) => {
        let userId = req.params.id as string;
        // TODO: move code to seperate function and create dependency injection
        try {
            const client = await getRedisClient();
            const reviewKey = reviewKeyById(userId);
            const reviewIds = await client.LRANGE(reviewKey, 0, 1);
            const result = await Promise.all(reviewIds.map(id => client.HGETALL(reviewDetailsKeyById(id))));
            successResponse(res, result, "get user reviews");
        } catch (error) {
            next(error);
        }
    }
);

router.post(
  "/:id/review",
  checkUserExists,
  validate(ReviewSchema),
  async (req, res, next) => {
    let body = req.body as Review;
    let userId = req.params.id as string;
    // TODO: move code to seperate function and create dependency injection
    try {
      const client = await getRedisClient();
      // TODO: change to nanoid
      const id = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      const reviewId = `${userId}_${id}`;
      const reviewDetailsKey = reviewDetailsKeyById(reviewId);
      const reviewKey = reviewKeyById(userId);
      const hashData = {
        id: reviewId,
        rating: body.rating,
        comment: body.comment,
      };
      const [reviewDetails, reviewsListCount, totalRatings] = await Promise.all([
        client.HSET(reviewDetailsKey, hashData),
        client.LPUSH(reviewKey, reviewId),
        client.HINCRBYFLOAT(userKeyById(userId), "totalRatings", hashData.rating)
      ]);
      const avgRating = Number((totalRatings/reviewsListCount).toFixed(2));
      const results = await Promise.all([
        client.ZADD(usersByRatingKey(), { score: avgRating, value: userId }),
        client.HSET(userKeyById(userId), "avgRating", avgRating)
      ]);
      successResponse(res, hashData, "added user");
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id/review/:rId",
  checkUserExists,
  async (req, res, next) => {
      let userId = req.params.id as string;
      let reviewId: string | undefined = req.params.rId
      if(!reviewId){
        errorResponse(res, 400, 'Bad request no id found!!');
      }

      // TODO: move code to seperate function and create dependency injection
      try {
          const client = await getRedisClient();
          const reviewDetailsKey = reviewDetailsKeyById(reviewId as string);
          const reviewKey = reviewKeyById(userId);
          const [remRes, delRes] = await Promise.all([
            client.LREM(reviewKey, 0, reviewId as string),
            client.DEL(reviewDetailsKey)
          ]);

          if(remRes === 0 && delRes === 0){
            errorResponse(res, 404, 'No Review Found!!');
          }

          successResponse(res, { deletedReviewId: reviewId }, "get user reviews");
      } catch (error) {
          next(error);
      }
  }
);

export default router;
