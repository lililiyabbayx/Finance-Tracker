const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");

// Import routes
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const analyticsRouter = require("./routes/analyticsRouter");
const recurrentEntriesRoutes = require("./routes/recurrentEntriesRoutes");
const financialInsightsRoutes = require("./routes/financialInsightsRoutes");
const travelExpensesRoutes = require("./routes/travelExpensesRoutes");
const financialWidgetsRoutes = require("./routes/financialWidgetsRoutes");
const revenueExpenseRoutes = require("./routes/revenueExpenseRoutes");
const chatbotRouter = require("./routes/chatbotRouter"); 
const kpiRouter = require("./routes/kpi");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3300;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("MongoDB connection error:", e));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/recurrent-entries", recurrentEntriesRoutes);
app.use("/api/v1/financial-insights", financialInsightsRoutes);
app.use("/api/v1/travel-expenses", travelExpensesRoutes);
app.use("/api/v1/financial-widgets", financialWidgetsRoutes);
app.use("/api/v1/revenue-expense", revenueExpenseRoutes);
app.use("/api/v1/chatbot", chatbotRouter);
app.use("/api/v1/kpi", kpiRouter);

// Error handler
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});