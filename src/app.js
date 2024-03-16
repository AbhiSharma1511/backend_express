
import express, { json } from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

// app.use is used for middlewre in application
app.use(cors({ 
    origin: process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(express.json({limit:"20Kb"}));
app.use(express.urlencoded({extended: true, limit:"20Kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js"


// routes declaration..................
app.use("/api/v1/user",userRouter)
// http://localhost:8000/api/v1/users/register




export {app}