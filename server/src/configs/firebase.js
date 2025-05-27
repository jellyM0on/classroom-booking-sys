import dotenv from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

const app = initializeApp({
  credential: cert({
    project_id: process.env.PROJECT_ID,
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

export const auth = getAuth(app);
