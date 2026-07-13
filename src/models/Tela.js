"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Import corregido para usar los tipos de Mongoose en TypeScript
const mongoose_1 = __importStar(require("mongoose"));
// Tipo genérico aplicado al esquema para mantener coincidencia con ITela
const TelaSchema = new mongoose_1.Schema({
    id_tela: {
        type: String,
        unique: true,
        default: () => 'T-' + Math.random().toString(36).substring(2, 7).toUpperCase() // Genera un ID al guardar si no existe
    },
    nombre_tela: { type: String, required: true },
    metros_tela: { type: Number, required: true },
    color_tela: { type: String, required: true },
    calidad_tela: { type: String, enum: ["1era", "2da", "3era"], required: true },
    fecha_ingreso: { type: Date, default: Date.now }
});
// Exportación limpia del modelo sin mezclar CommonJS
exports.default = mongoose_1.default.model("Tela", TelaSchema);
//# sourceMappingURL=Tela.js.map