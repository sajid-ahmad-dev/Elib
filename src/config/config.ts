import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  database_Url: process.env.DATABASE_URL,
};

export const config = Object.freeze(_config);
