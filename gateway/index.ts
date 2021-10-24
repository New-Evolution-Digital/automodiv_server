import { Console } from "console";
import express from "express";
import { HOST, PORT } from "./constants";

const app = express();
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
