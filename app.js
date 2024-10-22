require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect');
const express = require('express');
const app = express();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const morgan = require('morgan');
const authRouter = require('./router/auth_router');
const userRouter = require('./router/user_router');
const productRouter = require("./router/product_router");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

// middleware
app.use(morgan("tiny"));
app.use(express.static("./public"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileupload());
// router
app.get("/", async (req, res) => {
  res.send("Server is running ....");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
// error
app.use(notFound);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  } catch (error) {
    console.error('Error starting server:', error.message);
  }
}

start();

