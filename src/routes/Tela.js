"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telasRouter = void 0;
const express_1 = require("express");
const Tela_1 = __importDefault(require("../models/Tela"));
const pdfkit_1 = __importDefault(require("pdfkit"));
exports.telasRouter = (0, express_1.Router)();
exports.telasRouter.post('/', async (req, res) => {
    try {
        const nuevaTela = new Tela_1.default(req.body);
        await nuevaTela.save();
        res.status(201).json(nuevaTela);
    }
    catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});
exports.telasRouter.get('/', async (req, res) => {
    res.json(await Tela_1.default.find());
});
exports.telasRouter.get('/:id', async (req, res) => {
    // Tipamos el filtro de búsqueda para que Mongoose reconozca `id_tela`
    const tela = await Tela_1.default.findOne({ id_tela: req.params.id });
    tela ? res.json(tela) : res.status(404).json({ error: 'No encontrada' });
});
exports.telasRouter.get('/buscar/:nombre', async (req, res) => {
    try {
        const telas = await Tela_1.default.find({ nombre_tela: new RegExp(req.params.nombre, 'i') });
        telas.length > 0 ? res.json(telas) : res.status(404).json({ error: 'No encontradas' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error de búsqueda' });
    }
});
exports.telasRouter.put('/:id', async (req, res) => {
    try {
        // Tipamos el filtro para actualizar por `id_tela`
        const tela = await Tela_1.default.findOneAndUpdate({ id_tela: req.params.id }, req.body, { new: true });
        tela ? res.json(tela) : res.status(404).json({ error: 'No encontrada' });
    }
    catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});
exports.telasRouter.delete('/:id', async (req, res) => {
    // Tipamos el filtro de eliminación para `id_tela`
    const tela = await Tela_1.default.findOneAndDelete({ id_tela: req.params.id });
    tela ? res.json({ mensaje: 'Eliminada' }) : res.status(404).json({ error: 'No encontrada' });
});
exports.telasRouter.get('/reporte/pdf', async (req, res) => {
    try {
        const telas = await Tela_1.default.find();
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
        doc.pipe(res);
        doc.fontSize(20).text('Reporte de Telas', { align: 'center' });
        doc.moveDown();
        const [colId, colNombre, colMetros, colColor, colCalidad] = [50, 120, 250, 330, 420];
        let y = 180;
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('ID', colId, 150).text('Nombre', colNombre, 150).text('Metros', colMetros, 150).text('Color', colColor, 150).text('Calidad', colCalidad, 150);
        doc.moveTo(30, 165).lineTo(550, 165).stroke();
        doc.font('Helvetica');
        telas.forEach((t) => {
            if (y > 750) {
                doc.addPage();
                y = 50;
            }
            doc.text(t.id_tela, colId, y).text(t.nombre_tela, colNombre, y).text(t.metros_tela.toString(), colMetros, y).text(t.color_tela, colColor, y).text(t.calidad_tela, colCalidad, y);
            y += 25;
            doc.moveTo(30, y - 5).lineTo(550, y - 5).strokeColor('#cccccc').stroke();
        });
        doc.end();
    }
    catch (error) {
        res.status(500).json({ error: 'Error en PDF' });
    }
});
//# sourceMappingURL=Tela.js.map