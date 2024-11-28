import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

const connectToDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db(dbName);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Callback endpoint to handle data from Poptin
app.post('/poptin-callback', async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection('PoptinLeads'); // Replace with your actual collection name

  try {
    const data = req.body;

    // Extract relevant fields
    const email = data.textfieldemail;
    const phone = data.textfieldphone;
    const fbclid = data.fbclid;
    const createdDate = new Date(); // Current timestamp

    if (!email || !phone ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save data to MongoDB
    const result = await collection.insertOne({
      email,
      phone,
      fbclid,
      createdDate,
    });

    console.log("Data saved to DB:", result.ops[0]);
    res.status(200).json({ success: true, message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
