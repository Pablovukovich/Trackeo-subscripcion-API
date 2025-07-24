import { Router } from "express";

const userRouter = Router();

//RUTAS DE USER

//Obtener todos los users
userRouter.get('/', (req,res)=> res.send({title: 'GET all user'}))

//Obtener detalles de un user
userRouter.get('/:id', (req,res)=> res.send({title: 'GET user dtails'}))

//Crear un user
userRouter.post('/', (req,res)=> res.send({title: 'CREATE new user'}))

//Actualizar un user
userRouter.put('/:id', (req,res)=> res.send({title: 'UPDATE user'}))

//Eliminar un user 
userRouter.delete('/:id', (req,res)=> res.send({title: 'DELETE user'}))

export default userRouter