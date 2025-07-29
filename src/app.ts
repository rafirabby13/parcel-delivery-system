/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes/routes.index"
// import httpStatus from "http-status-codes"
import { globalErrorhandlers } from "./app/middlewares/globalErrorHandlers"
import { success } from "zod"
import { notFound } from "./app/middlewares/notFound"
const app = express()


app.use(express.json())
app.use(cors())
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Parcel Delivery system server " })
})

app.use(globalErrorhandlers)

app.use(notFound)
export default app;