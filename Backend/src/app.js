import express from "express"
import cors from "cors"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import roomRouter from './routes/room.routes.js';




const app = express()


app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use("/api/auth", authRouter)
app.use('/api/rooms', roomRouter);
export default app
