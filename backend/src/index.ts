import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks"; // Imports the route we fixed earlier!

const app = express();

app.use(cors());
app.use(express.json());

// This tells Express to actually USE your routes!
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes); 

AppDataSource.initialize().then(() => {
    console.log("📦 PostgreSQL connected & tables synced!");
    app.listen(5000, () => {
        console.log("🚀 Server running on http://localhost:5000");
    });
}).catch(error => console.log(error));