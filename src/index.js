import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import job from "./lib/cron.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
      "https://zerocode-fe-assignment-f8wg-mgib8z7t9-karam20s-projects.vercel.app/",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
