const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://srishtiimukherjee_db_user:5RtFzozIlH3f7g3I@cluster0.yxju1yz.mongodb.net/news-summarizer";

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
