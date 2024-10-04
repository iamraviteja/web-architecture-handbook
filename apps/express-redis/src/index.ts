import express from "express";

import getRedisClient, { disconnectClient } from "./utils/redisclient.js";

import UserRoutes from "./routes/user.js";
import SkillRoutes from "./routes/skills.js";
import FakeRoutes from "./routes/fake.js";

import { errorHandler } from "./middlewares/errorhandler.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// connect to redis
(async () => {
    await getRedisClient();
})()

// routes
app.use("/user", UserRoutes);
app.use("/skills", SkillRoutes);
app.use("/fake", FakeRoutes);

// app level middlewares
app.use(errorHandler);

let server = app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
})
.on('error', (error) => {
    throw new Error(error.message);
})

function appCleanUp() {
    if(server){
        server.close(async (error) => {
            if(error){
                throw new Error(error.message);
            }else {
                await disconnectClient();
            }
        })
    }
}

process.on('SIGINT', () => {
    console.log('run clean up on SIGINT!!');
    appCleanUp();
})

process.on('SIGTERM', () => {
    console.log('run clean up on SIGTERM!!');
    appCleanUp();
})