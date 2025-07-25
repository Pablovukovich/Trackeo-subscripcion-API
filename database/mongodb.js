import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "por favor declara MONGODB_URI como variable de entorno dentro de .env.<development/production>.local"
  );
}

//conexion a la base de datos

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`database conectada con exito en: ${NODE_ENV}`)
  } catch (error) {
    console.error("Error a conectar a la base de datos", error);
    process.exit(1);
  }
};

export default connectToDatabase;