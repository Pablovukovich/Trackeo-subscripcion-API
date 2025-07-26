import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  //Crear una sesion
  const sessison = await mongoose.startSession();
  sessison.startTransaction();

  try {
    //logica para crear un nuevo usuario
    //obtenemos el req body

    const { name, email, password } = req.body;

    //checkear si el user existe
    const userExist = await User.findOne({ email });

    if (userExist) {
      const error = new Error("el user ya existe ");
      error.statusCode = 409;
      throw error;
    }

    //hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //creamos nuevo usuario
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashPassword,
        },
      ],
      { sessison }
    );

    //generamos el token
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await sessison.commitTransaction();
    sessison.endSession();

    res.status(201).json({
      success: true,
      message: "User creado correctamente",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    await sessison.abortTransaction();
    sessison.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try{
    const {email, password}= req.body

    //check si el usuario existe
    const user = await User.findOne({email});

    if(!user){
        const error = new Error('Usuario no encontrado')
        error.statusCode = 404;
        throw error;
    }

    //machear las contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //si la constraseña no es valida 
    if(!isPasswordValid){
        const error = new Error('Constraseña invalida')
        error.statusCode = 401;
        throw error;
    }

    //generamos token 
     const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    //201
     res.status(201).json({
      success: true,
      message: "User signin correctamente",
      data: {
        token,
        user,
      },
    });


  }catch(error){
    next(error)
  }

};

export const signOut = async (req, res, next) => {
  //implementar logica de sign out aca
};
