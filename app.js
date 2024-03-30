const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express()
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connect to DB");
})
.catch(console.error);

app.use("/", mainRouter);
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})