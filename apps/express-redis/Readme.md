# Express Node App with Redis Connection

## Install steps
pnpm add -D @types/node @types/express typescript esbuild --filter=express-redis
pnpm add express redis zod --filter=express-redis

## Run redis locally 
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass mypassword" redis/redis-stack:latest

## Redis Data Types
### Hashes
- Field-value pairs
- Represents basic objects, counters etc
- No Nested data (arrays, objects), so skills cannot be added as its an array
- Fields added and removed as needed (no schema needed)

user:1 -> key
id 1
name Ravi
rollno 5
skills [] // optional

HSET sets the value of one or fields in the hash
HGET retruns the value at a given field
HGETALL returns all the fields and values of the hash stored at key
HMGET returns the values at one or more given fields
HINCRBY increments the values at a given field by the integer provided 

### Lists
- Linked list of string values
- Optimized for adding/removing add head/tail

reviews:user1 -> key
0 reviewid1
1 reviewid2
2 reviewid3

LPUSH/RPUSH adds a new element to the head/tail
LPOP/RPOP removes and returns an element from the head/tails of a list
LLEN returns the length of a list
LMOVE atomically moves elements from one list to another
LRANGE extracts a range of elements from a list
LTRIM reduces a list to the specified range of elements

### Sets
- Unordered Collection
- Unique strings

skills -> key
Cricket
Movies
Coding
Cooking

skill:cricket
userid1
userid2
userid3

user_skill:userid1
Cricket
Coding

SADD adds a new member to a set
SREM removes the specified member from the set
SISMEMBER tests a string for set membership
SINTER returns the set of members that two or more sets have in common
SCARD returns the size (cardinality) of a set

### Sets
- Unique strings
- Ordered by a "score"
- Leader board

users:by_rating -> key
userid1 3.5 (avg rating)
userid2 2
userid3 1

ZADD adds a member and asssociated score to a sorted set.
ZRANGE returns members of a sorted set, sorted within a given range (goes from low to high)
ZRANK returns the rank of the provided member,
ZREVRANK returns the rank of the provided member,


## Reference
https://github.com/redis/node-redis
https://www.totaltypescript.com/tsconfig-cheat-sheet