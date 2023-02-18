import express from "express";
import ussdRoute from "./index.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// app.use(json());
// app.use(urlencoded({ extended: false }));

app.use("/", ussdRoute);
app.listen(PORT, () => console.log(`running on localhost:${PORT}`));
