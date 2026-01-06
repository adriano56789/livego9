import { Document, Model, Schema, Types } from 'mongoose';

declare global {
  // Tipos auxiliares para o Mongoose
  type DocumentType<T> = Document<unknown, {}, T> & T & { _id: Types.ObjectId };
  
  type ResponseType<T> = Omit<T, keyof Document> & {
    _id: string;
    id: string;
    __v?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  // Adicione aqui outros tipos globais conforme necessário
}

// Extensão da interface global do Express para incluir tipos personalizados
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any; // Você pode substituir 'any' por um tipo de usuário mais específico
      io?: any;   // Adicione outros tipos personalizados conforme necessário
    }
  }
}

export {};
