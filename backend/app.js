require("dotenv").config();  // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

// Importing the route files for different features
const userRouter = require("./routes/userRouter");
const entryRouter = require("./routes/entryRoutes");  // This now handles transactions as well
const dashboardRouter = require("./routes/dashboardRoutes");
const emailAlertRouter = require("./routes/emailAlertRoutes");
const budgetRouter = require("./routes/budgetRoutes");
const expSumRouter = require("./routes/expSumRoutes");
const reportRouter = require("./routes/reportRoutes");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");

const KPI = require("./model/KPI");
const { kpis } = require("./data/data");

const PORT = process.env.PORT || 3303;

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';
console.log("MongoDB URI:", uri);

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");

    // Insert data for a specific user only if data does not exist
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
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware setup
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adding the routes for different functionalities
app.use('/api/v1/users', userRouter); 
app.use('/api/entries', entryRouter);  // This will now handle both entries and transactions
app.use('/api/dashboard', dashboardRouter);
app.use('/api/email-alerts', emailAlertRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/exp-sum', expSumRouter);
app.use('/api/report', reportRouter);

// Error handler middleware should be last
app.use(errorHandlerMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
