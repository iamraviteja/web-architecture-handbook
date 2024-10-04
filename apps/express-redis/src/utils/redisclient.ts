import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export default async function getRedisClient() {
  if (!client) {
    client = await createClient({
      url: "redis://default:mypassword@localhost:6379",
    });
    await client
      .on("error", (err) => {
        throw new Error(err);
      })
      .on("connect", () => {
        console.log("Redis client connected!!");
      })
      .connect();
  }

  return client;
}

export async function disconnectClient() {
  if (client) {
    await client.disconnect();
  }
}
