import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
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
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"], // ✅ Add both dev and deployed frontend URLs
    credentials: true, // ✅ Allow sending cookies
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
