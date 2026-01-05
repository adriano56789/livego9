import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { UserModel } from '../models/User';
import { messaging } from '../services/firebaseAdmin';

export const notificationController = {
  sendTestNotification: async (req: AuthRequest, res: any) => {
    try {
      const user = await UserModel.findOne({ id: req.userId });
      if (!user || !(user as any).fcmTokens || (user as any).fcmTokens.length === 0) {
        return sendError(res, "Nenhum dispositivo registrado para receber notificações.", 404);
      }

      const tokens = (user as any).fcmTokens;

      const message = {
        notification: {
          title: 'Teste de Notificação LiveGo 🚀',
          body: `Olá, ${(user as any).name}! A sua integração com o Firebase FCM V1 está funcionando.`,
        },
        tokens: tokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      console.log('FCM send response:', response);

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        console.log('List of tokens that caused failures: ' + failedTokens);
        // Opcional: Limpar tokens inválidos do banco de dados
        await UserModel.updateOne({ id: req.userId }, { $pullAll: { fcmTokens: failedTokens } });
      }

      return sendSuccess(res, { successCount: response.successCount, failureCount: response.failureCount }, "Notificação de teste enviada.");
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return sendError(res, "Falha ao enviar notificação de teste.", 500);
    }
  },
};
