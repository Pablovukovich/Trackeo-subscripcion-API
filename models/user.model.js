import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Por favor, poner un email válido']
    },
    password: {
        type: String,
        required: [true, 'Debe poner una contraseña'],
        minlength: 6
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
