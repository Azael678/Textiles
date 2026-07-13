import mongoose, { Schema, Document } from 'mongoose';

export interface ITela extends Document {
    id_tela?: string;
    nombre_tela: string;
    metros_tela: number;
    color_tela: string;
    calidad_tela: "1era" | "2da" | "3era";
    
}

const TelaSchema: Schema<ITela> = new Schema<ITela>({
    id_tela: {
        type: String,
        unique: true,
        default: () => 'T-' + Math.random().toString(36).substring(2, 7).toUpperCase() 
    },
    nombre_tela: { type: String, required: true },
    metros_tela: { type: Number, required: true },
    color_tela: { type: String, required: true },
    calidad_tela: { type: String, enum: ["1era", "2da", "3era"], required: true },

});

export default mongoose.model<ITela>("Tela", TelaSchema);