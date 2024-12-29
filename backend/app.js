require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const chatbotRouter = require("./routes/chatbotRouter"); // Ensure path is correct
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const analyticsRouter = require("./routes/analyticsRouter");
const recurrentEntriesRoutes = require("./routes/recurrentEntriesRoutes");
const financialInsightsRoutes = require("./routes/financialInsightsRoutes");
const travelExpensesRoutes = require("./routes/travelExpensesRoutes");
const financialWidgetsRoutes = require("./routes/financialWidgetsRoutes");

const kpiRouter = require("./routes/kpi");
const app = express();
const PORT = process.env.PORT || 3300;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("MongoDB connection error:", e));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Missing comma added here
    credentials: true, // Enable cookies/authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    allowedHeaders: ["Authorization", "Content-Type"], // Explicitly allow headers
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/", userRouter);

app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/chatbot", chatbotRouter);
app.use("/api/v1/kpi", kpiRouter);
app.use("/api/v1/travel-expenses", travelExpensesRoutes);
app.use("/api/v1/financial-widgets", financialWidgetsRoutes);
app.use("/api/v1/financial-insights", financialInsightsRoutes);
app.use("/api/v1/recurrent-entries", recurrentEntriesRoutes);
// Error handler
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});