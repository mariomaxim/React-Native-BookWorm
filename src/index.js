import express from "express";
import "dotenv/config";
import cors from "cors";
import booksRoutes from "./Routes/booksRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/auth",authRoutes);
app.use("/api/books",booksRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});

