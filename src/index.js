// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/dbc.js";
import { app } from "./app.js";


dotenv.config({
  path: "./.env",
});

console.log(process.env.MONGO_URI);
console.log(process.env.PORT);

connectDB()
.then(()=>{
  app.on("error",(error)=>{
    console.log("Error:",error);
    throw error
  })
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running at port: ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("Mongo db connection failed!!!", err);
})
