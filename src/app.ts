import { config } from "./config/config";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Global error handler   =>  this should be at the last after all the routes
// then only it will work fine

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode;
  res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === "development" ? err.stack : "",
  });
});
export default app;
