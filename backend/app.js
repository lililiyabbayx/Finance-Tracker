require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const analyticsRouter = require("./routes/analyticsRouter");
const app = express();
const PORT = process.env.PORT || 3300;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error("MongoDB connection error:", e));

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"], // Include Authorization header
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

// Error handler
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
