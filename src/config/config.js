const dotenv = require("dotenv");
dotenv.config({
  path: process.env.DOTENV_PATH || ".env",
});

const dbDialect = "postgres"; // Default to Postgres, can be changed based on environment

module.exports =  {
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: dbDialect,
  },
  server: {
    baseUrl: process.env.SERVER_BASE_URL || "http://localhost:5001",
    port: parseInt(process.env.SERVER_PORT) || 5001,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  llm: {
    gemini: process.env.GEMINI_API_KEY,
    openRouter: process.env.OPENROUTER_API_KEY,
  },

  frontendUrl: process.env.FRONTEND_URL,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

};