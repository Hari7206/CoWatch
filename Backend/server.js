import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { connectToDB } from "./src/db/database.js";

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);  

await connectToDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});