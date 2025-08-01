/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes/routes.index"
// import httpStatus from "http-status-codes"
import { globalErrorhandlers } from "./app/middlewares/globalErrorHandlers"
import cookieParser from "cookie-parser"
import { notFound } from "./app/middlewares/notFound"
import passport from "passport"
import expressSession from "express-session"
import { envVars } from "./app/config/env"
const app = express()



app.use(expressSession({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.set("trust proxy", 1)
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Parcel Delivery system server " })
})

app.use(globalErrorhandlers)

app.use(notFound)
export default app;