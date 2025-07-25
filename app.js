import express from "express";
import { PORT } from './config/env.js'
import userRouter from "./routes/user.routes.js";
import subscripcionRouter from "./routes/subscripcion.route.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscripciones', subscripcionRouter)

app.use(errorMiddleware)

/*
ejemplo: /api/v1/auth/sign-up
*/


app.get('/', (req,res)=>{
    res.send('bienvenido a subscription tracker API')

});

app.listen(PORT,async ()=>{
    console.log(`subscription trnackink API corre en http://localhost:${PORT}`)

    await connectToDatabase();
});

export default app;