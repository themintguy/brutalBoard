import express, { Application, Request, Response } from "express";
import { initSocket } from "./config/socket";
import morgan from "morgan";
import gameRoutes from "./routes/game.routes"
import claimRoutes from "./routes/claim.routes"
import userRoutes from "./routes/user.routes";
import cors from "cors";
import * as http from "http";


const app: Application = express();
const server = http.createServer(app);

initSocket(server);

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
  
//   }),
// )


// (async () => {
//   try {
//     const client = await pool.connect();
//     console.log("Database connected");

//     await client.query("SELECT 1");
//     client.release();
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
// })();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/game", gameRoutes);
app.use("/play", claimRoutes);
app.use("/users", userRoutes);




export default app;


