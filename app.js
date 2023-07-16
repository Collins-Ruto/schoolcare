import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import cors from "cors";
import mongoose from "mongoose";
// import mongodb from "mongodb";
import ussdRoute from "./src/pm-server.js";
import examRoutes from "./src/routes/examRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// app.use(json());
// app.use(urlencoded({ extended: false }));

app.use("/", ussdRoute);
// app.use("/exams", examRoutes);
app.use("/students", studentRoutes);

mongoose
  .connect(process.env.DATABASE_URL, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
