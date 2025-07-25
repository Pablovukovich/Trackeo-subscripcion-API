import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'el nombre de usuario es requerido'],
        trim: true,
        minLenght: 2,
        maxLenght: 50
    },
    email:{
        type: String,
        required: [true,'el nombre de usuario es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Por favor, poner un email valido']
    },
    password: {
        type: String,
        required:[true, 'Debe poner una contraseña'],
        minLenght: 6,

                                        
    }

},
    {timestamps: true}
)

const User =  mongoose.model('user', userSchema);

export default User;