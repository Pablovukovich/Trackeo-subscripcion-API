import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";

const userRouter = Router();

//RUTAS DE USER

//Obtener todos los users
userRouter.get('/', getUsers)

//Obtener detalles de un user
userRouter.get('/:id', authorize, getUser)

//Crear un user
userRouter.post('/', (req,res)=> res.send({title: 'CREATE new user'}))

//Actualizar un user
userRouter.put('/:id', (req,res)=> res.send({title: 'UPDATE user'}))

//Eliminar un user 
userRouter.delete('/:id', (req,res)=> res.send({title: 'DELETE user'}))

export default userRouter