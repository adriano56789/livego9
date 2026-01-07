import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

export const userController = {
    getMe: async (req: AuthRequest, res: any) => {
        try {
            const user = await UserModel.findOne({ id: req.userId });
            if (!user) return sendError(res, "Sessão inválida.", 404);
            return sendSuccess(res, user);
        } catch (err) {
            return sendError(res, "Erro ao processar dados.");
        }
    },

    getUser: async (req: any, res: any) => {
        try {
            const user = await UserModel.findOne({ id: req.params.id });
            if (!user) return sendError(res, "Perfil não encontrado.", 404);
            return sendSuccess(res, user);
        } catch (err) {
            return sendError(res, "Falha na consulta.");
        }
    },

    getOnlineUsers: async (req: any, res: any) => {
        try {
            const users = await UserModel.find({ isOnline: true }).limit(50);
            return sendSuccess(res, users);
        } catch (err) {
            return sendError(res, "Erro ao recuperar usuários.");
        }
    },

    updateBillingAddress: async (req: AuthRequest, res: any) => {
        try {
            const updated = await UserModel.findOneAndUpdate(
                { id: req.userId },
                { billingAddress: req.body },
                { new: true }
            );
            return sendSuccess(res, updated, "Endereço atualizado.");
        } catch (err) {
            return sendError(res, "Erro ao salvar endereço.");
        }
    },

    updateCreditCard: async (req: AuthRequest, res: any) => {
        try {
            const { number, brand, expiry } = req.body;
            // Salva apenas os 4 últimos dígitos por segurança (PCI Compliance Simulado)
            const cardData = {
                last4: number ? number.slice(-4) : '****',
                brand: brand || 'Visa',
                expiry: expiry
            };
            const updated = await UserModel.findOneAndUpdate(
                { id: req.userId },
                { creditCardInfo: cardData },
                { new: true }
            );
            return sendSuccess(res, updated, "Cartão vinculado.");
        } catch (err) {
            return sendError(res, "Erro ao salvar cartão.");
        }
    },

    follow: async (req: AuthRequest, res: any) => {
        try {
            const targetId = req.params.id;
            const myId = req.userId;
            const updatedMe = await UserModel.findOneAndUpdate(
                { id: myId },
                { $addToSet: { followingIds: targetId }, $inc: { following: 1 } },
                { new: true }
            );
            await UserModel.findOneAndUpdate({ id: targetId }, { $inc: { fans: 1 } });
            return sendSuccess(res, updatedMe);
        } catch (err) {
            return sendError(res, "Erro ao seguir.");
        }
    },

    registerFcmToken: async (req: AuthRequest, res: any) => {
        try {
            const { token } = req.body;
            if (!token) return sendError(res, "Token não fornecido.", 400);

            await UserModel.findOneAndUpdate(
                { id: req.userId },
                { $addToSet: { fcmTokens: token } }
            );
            
            return sendSuccess(res, null, "Token FCM registrado.");
        } catch (err) {
             return sendError(res, "Erro ao registrar token FCM.");
        }
    },

    muteUser: async (req: AuthRequest, res: any) => {
        try {
            const { userId, reason, durationHours = 24 } = req.body;
            
            if (!userId) {
                return sendError(res, "ID do usuário é obrigatório.", 400);
            }

            // Verificar se o usuário já está silenciado
            const user = await UserModel.findOne({ id: req.userId });
            if (!user) {
                return sendError(res, "Usuário não encontrado.", 404);
            }

            const alreadyMuted = user.mutedUsers.some(mutedUser => 
                mutedUser.userId === userId && mutedUser.mutedUntil > new Date()
            );

            if (alreadyMuted) {
                return sendError(res, "Este usuário já está silenciado.", 400);
            }

            // Calcular a data de expiração do silêncio
            const mutedUntil = new Date();
            mutedUntil.setHours(mutedUntil.getHours() + durationHours);

            // Adicionar à lista de usuários silenciados
            await UserModel.findOneAndUpdate(
                { id: req.userId },
                { 
                    $push: { 
                        mutedUsers: { 
                            userId,
                            mutedUntil,
                            reason: reason || ''
                        } 
                    } 
                },
                { new: true }
            );

            return sendSuccess(res, { mutedUntil }, "Usuário silenciado com sucesso.");
        } catch (err) {
            console.error("Erro ao silenciar usuário:", err);
            return sendError(res, "Erro ao silenciar usuário.");
        }
    },

    unmuteUser: async (req: AuthRequest, res: any) => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return sendError(res, "ID do usuário é obrigatório.", 400);
            }

            // Remover o usuário da lista de silenciados
            const result = await UserModel.findOneAndUpdate(
                { id: req.userId },
                { 
                    $pull: { 
                        mutedUsers: { userId } 
                    } 
                },
                { new: true }
            );

            if (!result) {
                return sendError(res, "Usuário não encontrado.", 404);
            }

            return sendSuccess(res, null, "Usuário removido da lista de silenciados.");
        } catch (err) {
            console.error("Erro ao remover silêncio do usuário:", err);
            return sendError(res, "Erro ao remover silêncio do usuário.");
        }
    },

    getMutedUsers: async (req: AuthRequest, res: any) => {
        try {
            const user = await UserModel.findOne({ id: req.userId })
                .select('mutedUsers')
                .populate({
                    path: 'mutedUsers.userId',
                    select: 'id name avatarUrl',
                    model: 'User'
                });

            if (!user) {
                return sendError(res, "Usuário não encontrado.", 404);
            }

            // Filtrar apenas os silenciamentos ativos
            const activeMutes = user.mutedUsers.filter(mutedUser => 
                mutedUser.mutedUntil > new Date()
            );

            return sendSuccess(res, activeMutes);
        } catch (err) {
            console.error("Erro ao buscar usuários silenciados:", err);
            return sendError(res, "Erro ao buscar usuários silenciados.");
        }
    }
};