import express from "express"
import User from "./models/user.model.js"
import "dotenv/config"
import { connectDB } from "./lib/db.js"
import { clerkMiddleware } from "@clerk/express"
import cors from "cors"
import fs from "fs"
import path from "path"
import job from "./lib/cron.js"
import clerkWebhook from "./webhooks/clerk.webhook.js"
import authRoutes from "./routes/auth.route.js"

const app = express()
const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL

const publicDir = path.join(process.cwd(), "public")

app.use("/api/webhooks/clerk", express.raw({type : "application/json"}), clerkWebhook)

app.use(express.json())
app.use(cors({origin : FRONTEND_URL, credentials : true}))
app.use(clerkMiddleware())

app.get("/health", (req, res) => {
    res.status(200).json({ok : true})
})

app.use("api/auth", authRoutes)

// if the public directory exists, serve the static files
// this is for production build
if(fs.existsSync(publicDir)){                   // does public folder exist
    app.use(express.static(publicDir))          // serve the built React files

    app.get("/{*any}", (req, res, next) => {     // any other URL -> send back to index.html
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err))
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server is up and Running on PORT", PORT)

    if(process.env.NODE_ENV === "production"){
        job.start()
    }
})