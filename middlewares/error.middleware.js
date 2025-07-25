const errorMiddleware = (err, req,res,next)=>{
    try{
        let error = {...err}

        error.message = err.message

        console.error(err)

        //moongose bad objetId
        if(err.name === 'CastError'){
            const message = 'Resourse not found'

            error = new Error(message);
            error.statusCode = 404;
        }

        //mongoose key duplicada
        if(err.code === 11000){
            const message = 'valor duplicado enter'

            error = new Error(message)
            error.statusCode = 400;

        }

        //mongoose error de validacion 
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message)
            error = new Error(message.join(', '))
            error.statusCode = 400;

        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'server error'}) 

    }catch(error){
        next(error)
    }
}

export default errorMiddleware;