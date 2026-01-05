import { sendSuccess, sendError } from '../utils/response';
import { ConversationModel } from '../models/Conversation';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const chatController = {
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

    getFriends: async (req: any, res: any) => {
        try {
            // Retorna usuários aleatórios como sugestão de amigos por enquanto
            const friends = await UserModel.find({ id: { $ne: req.userId } }).limit(10);
            return sendSuccess(res, friends);
        } catch (err) {
            return sendSuccess(res, []);
        }
    },

    getRanking: async (req: any, res: any) => {
        try {
            const topUsers = await UserModel.find().sort({ diamonds: -1 }).limit(20);
            const formattedRanking = topUsers.map((u: any, index) => ({
                ...u.toJSON(),
                rank: index + 1,
                value: u.diamonds * 10 // Simulação de contribuição
            }));
            return sendSuccess(res, formattedRanking);
        } catch (err) {
            return sendSuccess(res, []);
        }
    }
};
