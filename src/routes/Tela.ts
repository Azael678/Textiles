import { Router, Request, Response } from 'express';
import type { QueryFilter } from 'mongoose';
import Tela, { ITela } from '../models/Tela';
import PDFDocument from 'pdfkit';

export const telasRouter = Router();

telasRouter.post('/', async (req: Request, res: Response) => {
    try {
        const nuevaTela = new Tela(req.body);
        await nuevaTela.save();
        res.status(201).json(nuevaTela);
    } catch (error) { res.status(400).json({ error: 'Error al crear' }); }
});

telasRouter.get('/', async (req: Request, res: Response) => {
    res.json(await Tela.find());
});

telasRouter.get('/:id', async (req: Request, res: Response) => {
    // Tipamos el filtro de búsqueda para que Mongoose reconozca `id_tela`
    const tela = await Tela.findOne({ id_tela: req.params.id } as QueryFilter<ITela>);
    tela ? res.json(tela) : res.status(404).json({ error: 'No encontrada' });
});

telasRouter.get('/buscar/:nombre', async (req: Request, res: Response) => {
    try {
        const telas = await Tela.find({ nombre_tela: new RegExp(req.params.nombre as string, 'i') });
        telas.length > 0 ? res.json(telas) : res.status(404).json({ error: 'No encontradas' });
    } catch (error) { res.status(500).json({ error: 'Error de búsqueda' }); }
});

telasRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        // Tipamos el filtro para actualizar por `id_tela`
        const tela = await Tela.findOneAndUpdate({ id_tela: req.params.id } as QueryFilter<ITela>, req.body, { new: true });
        tela ? res.json(tela) : res.status(404).json({ error: 'No encontrada' });
    } catch (error) { res.status(400).json({ error: 'Error al actualizar' }); }
});

telasRouter.delete('/:id', async (req: Request, res: Response) => {
    // Tipamos el filtro de eliminación para `id_tela`
    const tela = await Tela.findOneAndDelete({ id_tela: req.params.id } as QueryFilter<ITela>);
    tela ? res.json({ mensaje: 'Eliminada' }) : res.status(404).json({ error: 'No encontrada' });
});

telasRouter.get('/reporte/pdf', async (req: Request, res: Response) => {
    try {
        const telas = await Tela.find();
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

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

        telas.forEach((t: any) => {
            if (y > 750) { doc.addPage(); y = 50; }
            doc.text(t.id_tela, colId, y).text(t.nombre_tela, colNombre, y).text(t.metros_tela.toString(), colMetros, y).text(t.color_tela, colColor, y).text(t.calidad_tela, colCalidad, y);
            y += 25;
            doc.moveTo(30, y - 5).lineTo(550, y - 5).strokeColor('#cccccc').stroke();
        });

        doc.end();
    } catch (error) { res.status(500).json({ error: 'Error en PDF' }); }
});