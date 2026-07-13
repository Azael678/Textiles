"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
exports.authRouter = (0, express_1.Router)();
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (e) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
exports.verificarToken = verificarToken;
exports.authRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ username, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Usuario creado" });
    }
    catch (error) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
});
exports.authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ error: "Usuario no encontrado" });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: "Contraseña incorrecta" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: "JWT_SECRET no configurado" });
            return;
        }
        // Generamos el token JWT con duración de 10 minutos
        const token = jsonwebtoken_1.default.sign({ user: username }, secret, { expiresIn: '10m' });
        res.json({ token, expiresIn: 600 });
    }
    catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});
//# sourceMappingURL=auth.js.map