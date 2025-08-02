import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { crearSubscripcion, getUserSubscripciones, getSubscripciones, getSubscripcionById, deleteSubscripcion, updateSubscripcion, cancelSubscripcion, getProximaRenovacion } from "../controllers/subscripcion.controller.js";

const subscripcionRouter = Router();

subscripcionRouter.get('/', getSubscripciones )

subscripcionRouter.get('/:id',authorize, getSubscripcionById)

subscripcionRouter.post('/',authorize, crearSubscripcion)

subscripcionRouter.put('/:id', authorize, updateSubscripcion)

subscripcionRouter.delete('/:id',authorize, deleteSubscripcion)

subscripcionRouter.get('/user/:id', authorize, getUserSubscripciones)

subscripcionRouter.put('/:id/cancel', authorize, cancelSubscripcion)

subscripcionRouter.get('/:id/proxima-renovacion',authorize, getProximaRenovacion)

export default subscripcionRouter;

