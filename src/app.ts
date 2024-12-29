import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Global error handler   =>  this should be at the last after all the routes
// then only it will work fine

app.use(globalErrorHandler);
export default app;
