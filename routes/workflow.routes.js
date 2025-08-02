import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router()

workflowRouter.post('/subscripciones/remider', sendReminders)

export default workflowRouter; 