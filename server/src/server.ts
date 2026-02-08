import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)

app.use(morgan("dev"));
app.use(express.json());



export default app;
