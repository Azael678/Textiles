"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./routes/auth");
const Tela_1 = require("./routes/Tela");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Sirve el frontend estático desde la carpeta public
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Conectado"))
    .catch(err => console.log("Error DB:", err));
app.use("/auth", auth_1.authRouter);
app.use("/telas", auth_1.verificarToken, Tela_1.telasRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));