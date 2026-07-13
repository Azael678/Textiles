import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { authRouter, verificarToken } from "./routes/auth";
import { telasRouter } from "./routes/Tela";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Conectado"))
    .catch(err => console.log("Error DB:", err));

app.use("/auth", authRouter);
app.use("/telas", verificarToken, telasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));