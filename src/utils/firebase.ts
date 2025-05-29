import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

import { getFirestore } from "firebase/firestore";
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { getAuth, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBK1BO8EhFcV4N_UEn0Cdiv7oJDQoAAKwk",
    authDomain: "cychael-energy.firebaseapp.com",
    projectId: "cychael-energy",
    storageBucket: "cychael-energy.firebasestorage.app",
    messagingSenderId: "733161382587",
    appId: "1:733161382587:web:bf50eeaf5ef8c9397d3f9e",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const ai = getAI(app, { backend: new GoogleAIBackend() });
auth
// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.0-flash" });
const storage = getStorage(app);
export { app, db, auth,model, storage };


// Initialize FirebaseApp

// Initialize the Gemini Developer API backend service
