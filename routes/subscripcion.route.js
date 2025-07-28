import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import { crearSubscripcion, getUserSubscripciones } from "../controllers/subscripcion.controller";

const subscripcionRouter = Router();

subscripcionRouter.get('/',(req,res)=> res.send({title: 'GET todas las subscripciones'}))

subscripcionRouter.get('/:id',(req,res)=> res.send({title: 'GET detalles de la subscripcion'}))

subscripcionRouter.post('/',authorize, crearSubscripcion)

subscripcionRouter.put('/:id',(req,res)=> res.send({title: 'UPDATE subscripciones'}))

subscripcionRouter.delete('/:id',(req,res)=> res.send({title: 'DELETE subscripciones'}))

subscripcionRouter.get('/user/:id', authorize, getUserSubscripciones)

subscripcionRouter.put('/:id/cancel',(req,res)=> res.send({title: 'CANCEL subscripciones'}))

subscripcionRouter.get('/proxima renovacion',(req,res)=> res.send({title: 'GET proxima renovacion'}))

export default subscripcionRouter;

