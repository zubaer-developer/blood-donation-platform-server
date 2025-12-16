const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Database and Collections
    const database = client.db(process.env.DB_NAME);

    const usersCollection = database.collection("users");
    const donationRequestsCollection = database.collection("donationRequests");
    const fundingsCollection = database.collection("fundings");

    // Test Route
    app.get("/", (req, res) => {
      res.send("Blood Donation Platform Server is Running!");
    });

    // ============ API Routes Will Go Here ============

    // Auth Routes
    app.post("/auth/register", async (req, res) => {
      res.send({ message: "Registration endpoint" });
    });

    app.post("/auth/login", async (req, res) => {
      res.send({ message: "Login endpoint" });
    });

    // USERS API created for testing
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (existingUser) {
          return res.send({ message: "User already exists", insertedId: null });
        }

        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add user" });
      }
    });

    // ============ End of Routes ============

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);
