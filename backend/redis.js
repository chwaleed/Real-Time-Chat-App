import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis Connected Successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    // Exit process or retry connection
    process.exit(1);
  }
};

export { client, connectRedis };
