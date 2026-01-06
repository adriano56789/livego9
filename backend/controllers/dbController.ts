
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError } from '../utils/response';
import { UserModel } from '../models/User';

// Definindo o tipo para o objeto de coleção do MongoDB
interface CollectionInfo {
    name: string;
    type?: string;  // Torna type opcional para compatibilidade
    options?: Record<string, any>;
    info?: {
        readOnly?: boolean;
        uuid?: any;
    };
    idIndex?: {
        v?: number;
        key?: {
            _id: number;
        };
        name?: string;
    };
}

// Tipos para as requisições
interface RequestWithBody<T> extends Request {
    body: T;
}

interface SetupDatabaseRequest {
    collections: string[];
}

interface DbController {
    listCollections: (req: Request, res: Response) => Promise<Response>;
    setupDatabase: (req: RequestWithBody<SetupDatabaseRequest>, res: Response) => Promise<Response>;
}

export const dbController: DbController = {
    listCollections: async (req: Request, res: Response) => {
        try {
            if (!mongoose.connection?.db) {
                return sendError(res, 'Conexão com o banco de dados não está disponível.', 500);
            }

            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionNames = collections.map((c: CollectionInfo) => c.name);
            return sendSuccess(res, collectionNames);
        } catch (err) {
            console.error('Erro ao listar coleções:', err);
            return sendError(res, 'Falha ao listar coleções do banco de dados.');
        }
    },
    
    setupDatabase: async (req: RequestWithBody<SetupDatabaseRequest>, res: Response) => {
        try {
            const { collections: requiredCollections } = req.body;

            if (!requiredCollections || !Array.isArray(requiredCollections)) {
                return sendError(res, 'A lista de coleções para setup não foi fornecida.', 400);
            }

            if (!mongoose.connection?.db) {
                return sendError(res, 'Conexão com o banco de dados não está disponível.', 500);
            }

            const appDb = mongoose.connection.db;
            const collections = await appDb.listCollections(undefined, { nameOnly: true }).toArray();
            const existingNames = collections.map((c: CollectionInfo) => c.name);
            const createdCollections: string[] = [];

            for (const collectionName of requiredCollections) {
                if (!existingNames.includes(collectionName)) {
                    await appDb.createCollection(collectionName);
                    createdCollections.push(collectionName);
                }
            }

            // Criação do usuário admin padrão
            let userCreated = false;
            const adminEmail = 'adrianomdk5@gmail.com'; // Atualizado e-mail admin
            const adminExists = await UserModel.exists({ email: adminEmail });

            if (!adminExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Adriano123', salt);
                const identification = '10000001';

                await UserModel.create({
                    id: `admin-${Date.now()}`,
                    identification,
                    name: 'Adriano Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    avatarUrl: `https://picsum.photos/seed/${identification}/200`,
                    coverUrl: `https://picsum.photos/seed/${identification}-c/1080/1920`,
                    level: 99,
                    diamonds: 999999
                });
                userCreated = true;
            }
            
            const message = `Sincronização completa. ${createdCollections.length} coleções criadas. Usuário Admin: ${userCreated ? 'Criado' : 'Já existia'}.`;
            return sendSuccess(res, { 
                success: true, 
                userCreated, 
                createdCollections, 
                message 
            });

        } catch (err: any) {
            console.error("Falha na configuração do banco de dados:", err);
            return sendError(res, `Falha na configuração do banco: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    },
};
