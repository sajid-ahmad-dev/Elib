import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
// Global error handler   =>  this should be at the last after all the routes
// then only it will work fine

app.use(globalErrorHandler);
export default app;
