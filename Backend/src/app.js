import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import roomRouter from "./routes/room.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(morgan("dev"));
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ status: "ok", service: "CoWatch API" });
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);

export default app;