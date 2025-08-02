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

// Hook para calcular automáticamente la renovación y actualizar el estado
subscripcionSchema.pre('save', function(next) {
    // Solo recalcula renovarFecha si es una suscripción nueva,
    // o si la fechaInicio o la frecuencia han sido modificadas.
    if (this.isNew || this.isModified('fechaInicio') || this.isModified('frecuencia')) {
        if (this.fechaInicio && this.frecuencia) {
            let nextRenewalDate = new Date(this.fechaInicio); // Crear una copia para no modificar fechaInicio

            switch (this.frecuencia) {
                case 'daily':
                    nextRenewalDate.setDate(nextRenewalDate.getDate() + 1);
                    break;
                case 'weekly':
                    nextRenewalDate.setDate(nextRenewalDate.getDate() + 7);
                    break;
                case 'monthly':
                    // Para meses, es mejor usar setMonth para avanzar exactamente un mes
                    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
                    break;
                case 'yearly':
                    // Para años, es mejor usar setFullYear para avanzar exactamente un año
                    nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
                    break;
                default:
                    // Esto no debería ocurrir si 'frecuencia' tiene un enum bien definido
                    break;
            }
            this.renovarFecha = nextRenewalDate;
        }
    }

    // Autorenovar el estado si la fecha de renovación ha pasado.
    // Importante: Este hook solo se ejecuta en 'save'/'update'.
    // Para actualizaciones en tiempo real, considera un cron job.
    // Solo cambiamos a 'Expirada' si el estado actual es 'Activa'
    if (this.renovarFecha && this.renovarFecha < new Date() && this.estado === 'Activa') {
        this.estado = 'Expirada';
    }

    next();
});

const Subscripcion = mongoose.model('Subscripcion', subscripcionSchema)

export default Subscripcion;