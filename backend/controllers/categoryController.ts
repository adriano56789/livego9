import { Request, Response } from 'express';
import { CategoryModel, ICategory } from '../models/Category';
import { sendSuccess, sendError } from '../utils/response';

// Categorias padrão do sistema
const DEFAULT_CATEGORIES = [
    { name: 'popular', label: 'Popular', order: 0, isDefault: true },
    { name: 'followed', label: 'Seguido', order: 1, isDefault: true },
    { name: 'nearby', label: 'Perto', order: 2, isDefault: true },
    { name: 'pk', label: 'PK', order: 3, isDefault: true },
    { name: 'new', label: 'Novo', order: 4, isDefault: true },
    { name: 'music', label: 'Música', order: 5, isDefault: true },
    { name: 'dance', label: 'Dança', order: 6, isDefault: true },
    { name: 'game', label: 'Jogos', order: 7, isDefault: true },
    { name: 'voice', label: 'Voz', order: 8, isDefault: true },
    { name: 'party', label: 'Festa', order: 9, isDefault: true },
    { name: 'private', label: 'Privada', order: 10, isDefault: true }
];

// Função para garantir que as categorias padrão existam
const ensureDefaultCategories = async () => {
    try {
        for (const cat of DEFAULT_CATEGORIES) {
            await CategoryModel.findOneAndUpdate(
                { name: cat.name },
                { $setOnInsert: { ...cat, isActive: false } },
                { upsert: true, new: true }
            );
        }
    } catch (error) {
        console.error('Erro ao garantir categorias padrão:', error);
    }
};

// Executa na inicialização
try {
    ensureDefaultCategories();
} catch (error) {
    console.error('Falha ao inicializar categorias padrão:', error);
}

export const categoryController = {
    // Listar todas as categorias ativas
    list: async (req: Request, res: Response) => {
        try {
            // Primeiro garante que as categorias padrão existam
            await ensureDefaultCategories();
            
            // Busca todas as categorias ativas, ordenadas por ordem
            const categories = await CategoryModel.find({ isActive: true })
                .sort({ order: 1, name: 1 });
            
            // Se não houver categorias, retorna as padrão
            if (categories.length === 0) {
                return sendSuccess(res, { 
                    data: DEFAULT_CATEGORIES 
                });
            }

            sendSuccess(res, { 
                data: categories.map(cat => cat.toJSON())
            });
        } catch (error: any) {
            console.error('Erro ao buscar categorias:', error);
            // Em caso de erro, retorna as categorias padrão
            sendSuccess(res, { 
                data: DEFAULT_CATEGORIES 
            });
        }
    },

    // Criar uma nova categoria (apenas admin)
    create: async (req: Request, res: Response) => {
        try {
            const categoryData: ICategory = req.body;
            
            // Verifica se já existe uma categoria com o mesmo nome
            const existing = await CategoryModel.findOne({ 
                name: categoryData.name.toLowerCase() 
            });
            
            if (existing) {
                return sendError(res, 'Já existe uma categoria com este nome', 400);
            }

            // Cria a nova categoria
            const newCategory = await CategoryModel.create({
                ...categoryData,
                name: categoryData.name.toLowerCase(),
                isDefault: false // Categorias criadas não são padrão
            });
            
            sendSuccess(res, { 
                data: newCategory,
                message: 'Categoria criada com sucesso',
                statusCode: 201 
            });
        } catch (error: any) {
            console.error('Erro ao criar categoria:', error);
            sendError(res, 'Erro ao criar categoria', 500);
        }
    },

    // Atualizar uma categoria (apenas admin)
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData: Partial<ICategory> = req.body;
            
            // Não permite atualizar categorias padrão
            const existing = await CategoryModel.findById(id);
            if (existing?.isDefault) {
                return sendError(res, 'Não é possível editar categorias padrão do sistema', 403);
            }
            
            // Atualiza a categoria
            const updatedCategory = await CategoryModel.findByIdAndUpdate(
                id,
                { 
                    ...updateData,
                    // Garante que o nome fique em minúsculas
                    ...(updateData.name ? { name: updateData.name.toLowerCase() } : {})
                },
                { new: true, runValidators: true }
            );

            if (!updatedCategory) {
                return sendError(res, 'Categoria não encontrada', 404);
            }

            sendSuccess(res, { 
                data: updatedCategory,
                message: 'Categoria atualizada com sucesso' 
            });
        } catch (error: any) {
            console.error('Erro ao atualizar categoria:', error);
            if (error.code === 11000) {
                sendError(res, 'Já existe uma categoria com este nome', 400);
            } else {
                sendError(res, 'Erro ao atualizar categoria', 500);
            }
        }
    },

    // Deletar uma categoria (apenas admin)
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            // Verifica se é uma categoria padrão
            const category = await CategoryModel.findById(id);
            if (!category) {
                return sendError(res, 'Categoria não encontrada', 404);
            }
            
            if (category.isDefault) {
                return sendError(
                    res, 
                    'Não é possível excluir categorias padrão do sistema',
                    403
                );
            }
            
            // Verifica se existem streams usando esta categoria
            const { StreamerModel } = await import('../models/Streamer');
            const streamCount = await StreamerModel.countDocuments({ category: id });
            
            if (streamCount > 0) {
                return sendError(
                    res, 
                    'Não é possível excluir esta categoria pois existem streams ativas nela',
                    400
                );
            }

            // Remove a categoria
            await CategoryModel.findByIdAndDelete(id);

            sendSuccess(res, { 
                message: 'Categoria removida com sucesso' 
            });
        } catch (error) {
            console.error('Erro ao remover categoria:', error);
            sendError(res, 'Erro ao remover categoria', 500);
        }
    },
    
    // Inicializar categorias padrão (para uso em scripts)
    initializeDefaults: async () => {
        await ensureDefaultCategories();
    }
};
