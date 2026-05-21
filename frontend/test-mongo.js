const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function run() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    await client.close();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

run();
