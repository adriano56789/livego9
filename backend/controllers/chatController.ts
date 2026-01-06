import { sendSuccess, sendError } from '../utils/response';
import { ConversationModel } from '../models/Conversation';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const chatController = {
    startChat: async (req: any, res: any) => {
        try {
            const { userId } = req.body;
            const currentUser = req.userId;

            if (!userId) {
                return sendError(res, 'ID do usuário é obrigatório', 400);
            }

            // Define o tipo da conversa
            type ConversationType = {
                _id: any;
                participants: string[];
                lastMessage?: string;
                unreadCount?: Map<string, number>;
                updatedAt?: Date;
                __v: number;
            };

            // Verifica se já existe uma conversa entre os usuários
            let conversation: ConversationType | null = await ConversationModel.findOne({
                participants: { $all: [currentUser, userId], $size: 2 }
            }).lean<ConversationType>();

            // Se não existir, cria uma nova conversa
            if (!conversation) {
                const newConversation = await ConversationModel.create({
                    participants: [currentUser, userId],
                    lastMessage: "",
                    unreadCount: new Map([[currentUser, 0]]),
                    updatedAt: new Date()
                });
                // Converte para objeto simples e tipa corretamente
                conversation = newConversation.toObject() as unknown as ConversationType;
            }

            // Busca informações do usuário para retornar na resposta
            const user = await UserModel.findById(userId).select('-password').lean();
            
            if (!user) {
                return sendError(res, 'Usuário não encontrado', 404);
            }

            return sendSuccess(res, {
                id: conversation._id,
                friend: {
                    id: user._id,
                    name: user.name,
                    avatarUrl: user.avatarUrl || '',
                    isOnline: user.isOnline || false,
                    level: user.level || 1
                },
                lastMessage: conversation.lastMessage || "",
                unreadCount: conversation.unreadCount?.get?.(currentUser) || 0,
                updatedAt: conversation.updatedAt || new Date()
            });
        } catch (err) {
            console.error('Erro ao iniciar chat:', err);
            return sendError(res, 'Erro ao iniciar conversa', 500);
        }
    },
    getFriends: async (req: any, res: any) => {
        try {
            const userId = req.userId;
            
            // Busca o usuário atual com os IDs dos usuários seguidos
            const user = await UserModel.findById(userId).select('followingIds').lean();
            
            if (!user) {
                return sendError(res, 'Usuário não encontrado', 404);
            }

            // Se não estiver seguindo ninguém, retorna array vazio
            if (!user.followingIds || user.followingIds.length === 0) {
                return sendSuccess(res, []);
            }

            // Busca os dados dos usuários seguidos
            const friendsData = await UserModel.find({
                _id: { $in: user.followingIds }
            }).select('name avatarUrl isOnline level').lean();
            
            // Formata a resposta para incluir apenas as informações necessárias
            const friends = friendsData.map((friend) => ({
                id: friend._id,
                name: friend.name,
                avatarUrl: friend.avatarUrl || '',
                isOnline: friend.isOnline || false,
                level: friend.level || 1,
                lastMessage: "",
                unreadCount: 0,
                updatedAt: new Date().toISOString()
            }));

            return sendSuccess(res, friends);
        } catch (err) {
            console.error('Erro ao buscar amigos:', err);
            return sendError(res, 'Erro ao buscar lista de amigos', 500);
        }
    },
    
    getConversations: async (req: any, res: any) => {
        try {
            const userId = req.userId;
            
            // Busca conversas reais no banco (ou retorna uma de boas-vindas se estiver vazio)
            let conversations = await ConversationModel.find({ 
                participants: userId 
            }).lean();

            if (conversations.length === 0) {
                // Mock de suporte para não vir vazio na primeira vez
                conversations = [{
                    id: 'conv-support',
                    friend: {
                        id: 'support-livercore',
                        name: 'Suporte LiveGo',
                        avatarUrl: 'https://picsum.photos/seed/support/200',
                        isOnline: true,
                        level: 99
                    },
                    lastMessage: 'Bem-vindo ao LiveGo! Como podemos ajudar?',
                    unreadCount: 1,
                    updatedAt: new Date().toISOString()
                }] as any;
            }

            return sendSuccess(res, conversations);
        } catch (err) {
            return sendSuccess(res, []); // Retorna vazio em vez de erro para não quebrar o app
        }
    },

    sendMessageToStream: async (req: AuthRequest, res: any, next: any) => {
        try {
            const { roomId } = req.params;
            const messagePayload = req.body;

            if (!roomId || !messagePayload || !messagePayload.message) {
                return sendError(res, 'Dados da mensagem inválidos.', 400);
            }
            
            // Aqui você poderia salvar a mensagem no banco de dados
            // Ex: await MessageModel.create({ ...messagePayload, roomId });

            if ((req as any).io) {
                (req as any).io.to(roomId).emit('newStreamMessage', {
                    ...messagePayload,
                    id: Date.now() 
                });
            }

            return sendSuccess(res, null, "Mensagem enviada.");
        } catch (error) {
            next(error);
        }
    },

    getRanking: async (req: any, res: any) => {
        try {
            const topUsers = await UserModel.find()
                .sort({ diamonds: -1 })
                .limit(20)
                .select('name avatarUrl diamonds level');
                
            const formattedRanking = topUsers.map((user, index) => ({
                id: user._id,
                name: user.name,
                avatarUrl: user.avatarUrl || '',
                diamonds: user.diamonds || 0,
                level: user.level || 1,
                rank: index + 1
            }));
            
            return sendSuccess(res, formattedRanking);
        } catch (err) {
            console.error('Erro ao buscar ranking:', err);
            return sendError(res, 'Erro ao buscar ranking', 500);
        }
    }
};
