import { GiftModel } from '../models/Gift';
import { UserModel } from '../models/User';
import { TransactionModel } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { messaging } from '../services/firebaseAdmin';

export const giftController = {
    getAll: async (req: any, res: any, next: any) => {
        try {
            const { category } = req.query;
            const query = category ? { category } : {};
            const gifts = await GiftModel.find(query).sort({ price: 1 });
            return sendSuccess(res, gifts);
        } catch (err: any) {
            next(err);
        }
    },

    sendGift: async (req: AuthRequest, res: any, next: any) => {
        try {
            const { giftName, amount, toUserId, streamId } = req.body;
            const fromUserId = req.userId; 

            const sender = await UserModel.findOne({ id: fromUserId });
            const gift = await GiftModel.findOne({ name: giftName });
            const receiver = toUserId ? await UserModel.findOne({ id: toUserId }) : null;


            if (!sender || !gift) return sendError(res, "Dados de transação inválidos.", 404);

            const totalCost = (gift as any).price * amount;
            if ((sender as any).diamonds < totalCost) {
                return sendError(res, "Saldo de diamantes insuficiente.", 400);
            }

            const updatedSender = await UserModel.findOneAndUpdate(
                { id: fromUserId },
                { $inc: { diamonds: -totalCost, xp: totalCost } },
                { new: true }
            );

            if (toUserId) {
                const earningsForReceiver = Math.floor(totalCost * 0.5);
                await UserModel.findOneAndUpdate(
                    { id: toUserId },
                    { $inc: { earnings: earningsForReceiver } }
                );
            }

            await TransactionModel.create({
                id: `gift-${Date.now()}`,
                userId: fromUserId,
                type: 'gift',
                amountDiamonds: totalCost,
                status: 'completed',
                details: { giftName, recipientId: toUserId, quantity: amount }
            });
            
            // Dispara o evento WebSocket para a sala específica
            if ((req as any).io && streamId) {
                const giftPayload = {
                    fromUser: updatedSender,
                    toUser: { id: toUserId, name: (receiver as any)?.name || 'Streamer' },
                    gift: gift,
                    quantity: amount,
                    roomId: streamId 
                };
                (req as any).io.to(streamId).emit('newStreamGift', giftPayload);
            }

            // Envia notificação push para o recebedor do presente
            if (receiver && (receiver as any).fcmTokens && (receiver as any).fcmTokens.length > 0) {
                const tokens = (receiver as any).fcmTokens;
                const message = {
                    notification: {
                        title: 'Você recebeu um presente! 🎁',
                        body: `${(sender as any).name} te enviou ${amount}x ${(gift as any).name}!`,
                    },
                    tokens: tokens,
                };
                
                messaging.sendEachForMulticast(message).then(response => {
                    console.log('FCM gift notification sent:', response);
                    if (response.failureCount > 0) {
                        const failedTokens: string[] = [];
                        response.responses.forEach((resp, idx) => {
                          if (!resp.success) {
                            failedTokens.push(tokens[idx]);
                          }
                        });
                        console.log('Tokens que falharam na notificação de presente: ' + failedTokens);
                        UserModel.updateOne({ id: toUserId }, { $pullAll: { fcmTokens: failedTokens } }).catch(err => console.error("Falha ao limpar tokens FCM inválidos", err));
                    }
                }).catch(error => {
                    console.error('Erro ao enviar notificação de presente via FCM:', error);
                });
            }

            return sendSuccess(res, updatedSender, "Presente enviado com sucesso.");
        } catch (error: any) {
            next(error);
        }
    }
};
