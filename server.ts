import "dotenv/config";
import app from "./src/app";

const startServer = () => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
};

startServer();
