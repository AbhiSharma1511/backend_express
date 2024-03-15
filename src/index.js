// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/dbc.js";

dotenv.config({
  path: "./.env",
});

console.log(process.env.MONGO_URI);
console.log(process.env.PORT);

connectDB();
