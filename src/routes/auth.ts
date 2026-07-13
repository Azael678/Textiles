import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const authRouter = Router();

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) { res.status(401).json({ error: 'Token requerido' }); return; }
    
    try { 
        jwt.verify(token, process.env.JWT_SECRET as string); 
        next(); 
    } catch (e) { 
        res.status(401).json({ error: 'Token inválido' }); 
    }
};

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) { res.status(401).json({ error: "Usuario no encontrado" }); return; }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) { res.status(401).json({ error: "Contraseña incorrecta" }); return; }

        const secret = process.env.JWT_SECRET as string;
        if (!secret) { res.status(500).json({ error: "JWT_SECRET no configurado" }); return; }

        // Generamos el token JWT con duración de 10 minutos
        const token = jwt.sign({ user: username }, secret, { expiresIn: '10m' });
        res.json({ token, expiresIn: 600 });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});