/* eslint-disable no-console */
import { Server } from "http"
import mongoose from "mongoose";
import dotenv from "dotenv"
import app from "./app";
import { envVars } from "./app/config/env";
dotenv.config()
let server: Server;



const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on port ${envVars.PORT} `)
        })

    } catch (error) {
        console.log(error)
    }

}
startServer()


process.on("SIGTERM", (err) => {
    console.log("SIGTERM Signal Recieved.......server shutdown", err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })

    }

    process.exit(1)
})
process.on("SIGINT", (err) => {
    console.log("SIGINT Signal Recieved......server shutdown", err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })

    }

    process.exit(1)
})
process.on("unhandledRejection", (err) => {
    console.log("Unhandle Rejection detected.......server shutdown", err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })

    }

    process.exit(1)
})
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected.......server shutdown", err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })

    }

    process.exit(1)
})


// Promise.reject(new Error("I forget to catch this promis"))

// throw new Error("I forgot")