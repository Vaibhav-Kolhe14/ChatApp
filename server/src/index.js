require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB.js");
const cookieParser = require("cookie-parser");
const { app, server } = require("./utils/socket.js");

// Route Import
const userRouter = require("./routes/userRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");

const PORT = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

// Start server after successful database connection
connectDB()
.then(() => {
    console.log("DB Connected successfully!");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1); // Exit process if DB connection fails
});
