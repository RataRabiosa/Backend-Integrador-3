import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    email: {
            type: String,
            required: [true, "El email es requerido"],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Por favor ingrese un email válido",
            ],
        },
    resetToken: {
        type: String,
        required: [true, "El token de restablecimiento es requerido"],
    },
    isValid: {
            type: Boolean,
            default: true,
        },
    expireAt: {
        type: Date,
        required: [true, "La fecha de expiración es requerida"],
        default: Date.now,
        index: { expires: '1h' } // El documento expirará 1 hora después de la creación
    }
}, { timestamps: true });

const PasswordReset = mongoose.model('PasswordReset', orderSchema);

export default PasswordReset;