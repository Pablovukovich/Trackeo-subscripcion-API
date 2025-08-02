import { config } from "dotenv";

//configuracion de variables de entorno

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, DB_URI,JWT_SECRET,JWT_EXPIRES_IN, ARCJET_ENV, ARCJET_KEY, QSTASH_URL, QSTASH_TOKEN, SERVER_URL, EMAIL_PASSWORD } = process.env;
