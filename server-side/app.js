const express = require("express");
const cors = require("cors");
const dbConnection = require("./db/dbConfig");
const createTables = require("./db/dbSchema");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// User route middleware file
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");

// auth middleware file
const authMiddleware = require("./middleware/authMiddleware");

// PORT
const PORT = 2224;

const start = async () => {
  try {
    const [result] = await dbConnection.execute("select 'test' AS test ");
    app.listen(PORT);
    console.log("Database connected successfully");

    console.log(`Listening to PORT: ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
};
start();

app.get("/", async (req, res) => {
  res.send("Welcome");
});

// Table creation with an endpoint
app.get("/create-tables", createTables);

// users routes middleware
app.use("/api/users", userRoutes);

// questions routes middleware
app.use("/api", questionRoutes);
// answers routes middleware
app.use("/api", answerRoutes);

module.exports = app;
