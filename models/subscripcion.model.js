import mongoose from "mongoose";

const subscripcionSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'El nombre de la subscripcion es requerida'],
        trim: true,
        minLenght: 2,
        maxLenght: 100,
    },
    price:{
        type: Number,
        required: [true, 'El precio de la subscripcion es requerida'],
        min: [0, 'El precio debe ser mayor a 0'],
        max: [1000, 'El precio debe ser menor a 1000']
    },
    moneda: {
        type: String,
        enum: ['ARS','USD','EUR'],
        default: 'ARS'
    },
    frecuencia:{
        type: String,
        enum: ['daily','weekly', 'monthly','yearly']
    },
    categoria:{
        type: String,
        enum: ['Sport','entretenimiento','Estilo de vida','Tecnologia','Finanzas','otros'],
        required: true,

    },
    metodoPago:{
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: String,
        enum: ['Activa','Cancelada','Expirada'],
        default:'Activa' 
    },
    fechaInicio:{
        type: Date,
        required: true,
        validate:{
            validator: (value)=> value <= new Date(),
            message:'La fecha de inicio debe ser pasada'
        }
    },
    renovarFecha:{
        type: Date,
        required: true,
        validate:{
            validator: function (value){ 
                return value > this.fechaInicio
            },
            message:'La fecha de renovacion debe ser despues de la fecha de inicio'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        index: true,
    }     


}, {timestamps: true});

//calcula automaticamente la renovacion si se pierde
subscripcionSchema.pre('save', function(next){
    if(!this.renovarFecha){
        const peridosRenovacion = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }
        this.renovarFecha =new Date(this.fechaInicio);
        this.renovarFecha.setDate(this.renovarFecha.getDate() + peridosRenovacion[this.frecuencia])
    }

    //autorenovar el estado si la fecha de renovacion ha pasado
    if(this.renovarFecha < new Date()){
        this.estado = 'Expirada'
    }

    next();
})

const Subscripcion = mongoose.model('Subscripcion', subscripcionSchema)

export default Subscripcion;