import express from "express";
import { PORT } from './config/env.js'
const app = express();

app.get('/', (req,res)=>{
    res.send('bienvenido a subscription tracker API')

});

app.listen(3000,()=>{
    console.log(`subscription trnackink API corre en http://localhost:${PORT}`)
});

export default app;