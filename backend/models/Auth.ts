import mongoose, { Document, Schema, Model } from 'mongoose';
import { DocumentType } from '../types/mongoose';

/**
 * Interface para o modelo de Autenticação
 */
export interface IAuth {
  usuarioId: string;         // ID do usuário autenticado
  tokenAtualizacao: string;  // Token de atualização JWT
  agenteUsuario: string;     // User-Agent do navegador/dispositivo
  enderecoIp: string;        // Endereço IP do usuário
  dataExpiracao: Date;       // Data de expiração do token
  ultimoUso: Date;           // Data do último uso do token
  revogado: boolean;         // Se o token foi revogado
}

export type AuthDocument = DocumentType<IAuth>;

const AuthSchema = new Schema<IAuth>({
  usuarioId: { 
    type: String, 
    required: [true, 'ID do usuário é obrigatório'],
    ref: 'Usuario',
    index: true 
  },
  tokenAtualizacao: { 
    type: String, 
    required: [true, 'Token de atualização é obrigatório'],
    unique: true
  },
  agenteUsuario: { 
    type: String, 
    required: [true, 'User-Agent é obrigatório']
  },
  enderecoIp: { 
    type: String, 
    required: [true, 'Endereço IP é obrigatório']
  },
  dataExpiracao: { 
    type: Date, 
    required: [true, 'Data de expiração é obrigatória']
  },
  ultimoUso: { 
    type: Date, 
    default: Date.now 
  },
  revogado: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: {
    createdAt: 'criadoEm',
    updatedAt: 'atualizadoEm'
  },
  toJSON: {
    transform: (doc, ret) => {
      const { _id, __v, ...auth } = ret;
      return {
        id: _id.toString(),
        ...auth
      };
    }
  }
});

// Índices para melhorar a performance
AuthSchema.index({ usuarioId: 1, revogado: 1 });
AuthSchema.index({ tokenAtualizacao: 1 }, { unique: true });

// Índice TTL para remoção automática de tokens expirados (30 dias)
AuthSchema.index({ dataExpiracao: 1 }, { expireAfterSeconds: 0 });

// Adicionando métodos personalizados
AuthSchema.methods.revogar = function() {
  this.revogado = true;
  return this.save();
};

export interface IAuthModel extends Model<IAuth> {
  // Adicione aqui métodos estáticos se necessário
}

export const AuthModel = mongoose.model<IAuth, IAuthModel>('Auth', AuthSchema);
