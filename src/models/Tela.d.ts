import mongoose, { Document } from 'mongoose';
export interface ITela extends Document {
    id_tela?: string;
    nombre_tela: string;
    metros_tela: number;
    color_tela: string;
    calidad_tela: "1era" | "2da" | "3era";
    
}
declare const _default: mongoose.Model<ITela, {}, {}, {}, Document<unknown, {}, ITela, {}, mongoose.DefaultSchemaOptions> & ITela & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITela>;
export default _default;
//# sourceMappingURL=Tela.d.ts.map