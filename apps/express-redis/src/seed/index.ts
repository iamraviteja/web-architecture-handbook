import { SchemaFieldTypes } from "redis";
import getRedisClient from "../utils/redisclient";
import { fakeUsersIndexKey, fakeUsersKey, getKey } from "../utils/rediskeys";

(async function createIndex() {
  const client = await getRedisClient();

  try {
    let result = await client.ft.dropIndex(fakeUsersIndexKey);
  } catch (error) {
    console.log("No index found!!");
  }

 

  await client.ft.create(fakeUsersIndexKey, {
    "$.id": {
      type: SchemaFieldTypes.NUMERIC,
      AS: "id",
    },
    "$.name": {
      type: SchemaFieldTypes.TEXT,
      AS: "name",
    },
    "$.username": {
      type: SchemaFieldTypes.TEXT,
      AS: "username",
    },
  }, {
    ON: "JSON",
    PREFIX: getKey('fake_users')
  });

  let fakeUsers: any = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  ).then((r) => r.json());

  if (fakeUsers) {
    await Promise.all(
      fakeUsers.map((u: any) => client.json.set(fakeUsersKey(u.id), ".", u))
    );
  }

  process.exit();
})();
