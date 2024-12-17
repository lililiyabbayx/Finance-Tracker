require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const userRouter = require("./routes/userRouter");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const kpiRouter = require("./routes/kpi");
const KPI = require("./model/KPI");
const { kpis } = require("./data/data");
const PORT = process.env.PORT || 3300;
const User = require("./model/User");

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri);

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

// Middleware setup
// Allow only specific origin (your frontend URL)
const corsOptions = {
  origin: "http://localhost:5173", // Make sure this matches the frontend URL
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions)); // Use the updated CORS settings

app.use(express.json());
app.use(errorHandlerMiddleware);
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server
console.log("Server started");
app.use("/", userRouter);

// Insert data only once or as needed
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Add data for a specific user
  const userId = new mongoose.Types.ObjectId("67603cd7ec53be790703d3f6");

  // Check if data already exists for this user
  KPI.findOne({ userId })
    .then((existingKPI) => {
      if (!existingKPI) {
        const kpisWithUserId = kpis.map((kpi) => ({
          ...kpi,
          userId, // Set the userId for each KPI document
        }));

        // Insert the new data
        KPI.insertMany(kpisWithUserId)
          .then(() => {
            console.log("KPI data inserted for user", userId);
          })
          .catch((error) => {
            console.error("Error inserting KPI data:", error);
          });
      } else {
        console.log("KPI data already exists for this user.");
      }
    })
    .catch((error) => {
      console.error("Error fetching KPI data:", error);
    });
});

app.use("/kpi", kpiRouter);
