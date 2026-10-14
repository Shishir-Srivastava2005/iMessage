import express from "express"
import User from "./models/user.model.js"
import "dotenv/config"
import { connectDB } from "./lib/db.js"
import { clerkMiddleware } from "@clerk/express"
import cors from "cors"

const app = express()
const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(express.json())
app.use(cors({origin : FRONTEND_URL, credentials : true}))
app.use(clerkMiddleware())

app.get("/health", (req, res) => {
    res.status(200).json({ok : true})
})

app.listen(PORT, () => {
    connectDB();
})