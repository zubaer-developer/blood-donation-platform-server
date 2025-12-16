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

    // Auth Routes ===========
    // User Registration
    app.post("/auth/register", async (req, res) => {
      const {
        email,
        password,
        confirm_password,
        name,
        avatar,
        bloodGroup,
        district,
        upazila,
      } = req.body;

      if (!email || !password || password !== confirm_password) {
        return res
          .status(400)
          .send({ message: "Invalid input or passwords do not match." });
      }

      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res
            .status(409)
            .send({ message: "User with this email already exists." });
        }

        // Password hash
        const hashedPassword = await hashPassword(password);

        // Create User document
        const newUser = getUserDocument({
          name,
          email,
          avatar,
          bloodGroup,
          district,
          upazila,
          password: hashedPassword,
        });

        const result = await usersCollection.insertOne(newUser);

        // Create JWT Token
        const token = createToken({
          email,
          userId: result.insertedId,
          role: "donor",
          status: "active",
        });

        res
          .status(201)
          .send({
            message: "User registered successfully",
            token,
            user: { name, email, role: "donor", status: "active" },
          });
      } catch (error) {
        console.error("Registration error:", error);
        res
          .status(500)
          .send({ message: "An error occurred during registration." });
      }
    });

    app.post("/auth/login", async (req, res) => {
      res.send({ message: "Login endpoint" });
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
