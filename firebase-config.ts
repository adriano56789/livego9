import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ToastType } from "./types";
import { api } from "./services/api";

// TODO: Substitua pelas suas credenciais reais do Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const setupFirebaseMessaging = async (addToast: (type: ToastType, message: string) => void): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      const currentToken = await getToken(messaging, {
        vapidKey: "BJamjvLU2QconKZHYCXSuhkd8lvSIP0vfe4Psuxp_IywVMdQ_cT1JJGtfmRFpovU_iKqLN9kPBr01g5sUKoDzoY"
      });

      if (currentToken) {
        // Listener para mensagens em primeiro plano
        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
          const title = payload.notification?.title || "Nova Notificação";
          const body = payload.notification?.body || "";
          addToast(ToastType.Info, `${title}: ${body}`);
        });
        return currentToken;
      } else {
        console.log("No registration token available. Request permission to generate one.");
        return null;
      }
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while setting up FCM.", error);
    return null;
  }
};
