import { Router } from "express";

const subscripcionRouter = Router();

subscripcionRouter.get('/',(req,res)=> res.send({title: 'GET todas las subscripciones'}))

subscripcionRouter.get('/:id',(req,res)=> res.send({title: 'GET detalles de la subscripcion'}))

subscripcionRouter.post('/',(req,res)=> res.send({title: 'CREATE subscripciones'}))

subscripcionRouter.put('/:id',(req,res)=> res.send({title: 'UPDATE subscripciones'}))

subscripcionRouter.delete('/:id',(req,res)=> res.send({title: 'DELETE subscripciones'}))

subscripcionRouter.get('/user/:id',(req,res)=> res.send({title: 'GET todas las subscripciones de un usuario'}))

subscripcionRouter.put('/:id/cancel',(req,res)=> res.send({title: 'CANCEL subscripciones'}))

subscripcionRouter.put('/:id/cancel',(req,res)=> res.send({title: 'CANCEL subscripciones'}))

subscripcionRouter.get('/proxima renovacion',(req,res)=> res.send({title: 'GET proxima renovacion'}))
export default subscripcionRouter;

