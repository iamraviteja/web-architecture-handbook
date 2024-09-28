import express from "express";

import UserRoutes from "./routes/user.js";

import { errorHandler } from "./middlewares/errorhandler.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// routes
app.use("/user", UserRoutes);

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
        server.close((error) => {
            if(error){
                throw new Error(error.message);
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