require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/userRouter");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const PORT = process.env.PORT || 3000;
//connect to mongodb
// Check if MONGODB_URI is loaded correctly
console.log("MongoDB URI:", process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));
//middleware
app.use(cors());
app.use(express.json());
app.use(errorHandlerMiddleware);
//routes
app.use("/", userRouter);
//START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
