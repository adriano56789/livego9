import admin from 'firebase-admin';
import { config } from '../config/settings';

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');

  if (!serviceAccount.project_id) {
    throw new Error("Credenciais do Firebase não encontradas ou inválidas no .env. Verifique a variável FIREBASE_SERVICE_ACCOUNT_JSON.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('❌ Falha ao inicializar o Firebase Admin SDK:', error);
  // A aplicação continuará, mas o envio de notificações falhará.
}

export const messaging = admin.messaging();
export default admin;
