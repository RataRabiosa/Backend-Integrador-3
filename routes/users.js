import express from 'express';
import User from '../models/User.js';
import validateAuth from '../middelwares/auth.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import PasswordReset from '../models/PasswordReset.js';
import gmail from '../config/mail.js';

const router = express.Router();

// Validar campos para registro
const registerValidation = [
    body('firstName').notEmpty().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().normalizeEmail().withMessage('El email no es válido'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validar campos para login
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
];

// Formato de correo
const emailFormat = {
    from: "mercadopresosrl@gmail.com",
    to: "",
    subject: "",
    html: ""
}

//Funcion que genera el jwt token
const generateAccessToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

// Funcion que genera el token de reseteo
const generateResetToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 20; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Ruta de registro
router.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: "Error de validación",
            errors: errors.array() 
        });
    }

    const { firstName, lastName, email, password, userRole } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Ya existe un usuario registrado con el mismo email, por favor inicia sesión." 
            });
        }

        const newUser = new User({ firstName, lastName, email, password, userRole });
        await newUser.save();

        const token = generateAccessToken(newUser);

        // Enviar correo de bienvenida
        emailFormat.to = newUser.email;
        emailFormat.subject = "Bienvenido a MercadoPreso";
        emailFormat.html = `<h1>Hola ${newUser.firstName}</h1><p>Bienvenido a MercadoPreso. Gracias por registrarte.</p>`;

        // Send the email
        gmail.sendMail(emailFormat, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente.",
            data: {
                user: newUser,
                access_token: token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: "Error interno del servidor"
        });
    }
});

// Ruta de login
router.post('/login', loginValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: "Error de validación",
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Credenciales inválidas" 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Credenciales inválidas" 
            });
        }
        console.log(user);
        const token = generateAccessToken(user);

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso.",
            data: {
                "access_token": token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: "Error interno del servidor"
        });
    }
});

// Ruta de perfil
router.get('/profile', validateAuth, async (req, res) => {
   return res.status(200).json({ 
            success: true,
            message: req.user.userdata
        });
}); 

// Ruta para listar usuarios existentes
router.get('/', validateAuth, async (req, res) => {
    // Validar que el usuario sea admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }

    try {
        const users = await User.find();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios"
        });
    }
});

// Ruta para resetar contraseña
router.post('/reset-password', async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query;

    try {
        const passwordReset = await PasswordReset.findOne({ resetToken: token });
        if (!passwordReset || (passwordReset.expireAt < Date.now()) || passwordReset.isValid === false) {
            return res.status(404).json({
                success: false,
                message: "Token invalido o expirado"
            });
        }
        passwordReset.isValid = false;
        await passwordReset.save();

        const user = await User.findById(passwordReset.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: "Contraseña actualizada exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña"
        });
    }
});

// Ruta de olvide mi contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const newToken = new PasswordReset({ userId: user.id, email: user.email, resetToken: generateResetToken(), expireAt: Date.now() + 3600000 }); // 1 hora
        await newToken.save();

        // Aquí iría la lógica para enviar un email con el enlace de restablecimiento
        emailFormat.to = user.email;
        emailFormat.subject = "Recuperación de contraseña - MercadoPreso";
        emailFormat.html = `<h1>Hola ${user.firstName}</h1><p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: <a href="${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(newToken.resetToken)}">Restablecer contraseña</a></p>`;

        // Send the email
        gmail.sendMail(emailFormat, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({
            success: true,
            message: `Hemos enviado un enlace de recuperación a tu correo electrónico.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al procesar la solicitud"
        });
    }
});

// Ruta para eliminar usuarios
router.delete('/:id', validateAuth, async (req, res) => {
    // Validar que el usuario sea admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: "Contraseña actualizada exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña"
        });
    }
});

// Ruta de olvide mi contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        
        const newToken = new PasswordReset({ userId: user.id, email: user.email, resetToken: generateResetToken(), expireAt: Date.now() + 3600000 }); // 1 hora
        await newToken.save();

        // Aquí iría la lógica para enviar un email con el enlace de restablecimiento
        emailFormat.to = user.email;
        emailFormat.subject = "Recuperación de contraseña - MercadoPreso";
        emailFormat.html = `<h1>Hola ${user.firstName}</h1><p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: <a href="${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(newToken.resetToken)}">Restablecer contraseña</a></p>`;

        // Send the email
        gmail.sendMail(emailFormat, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({
            success: true,
            message: `Hemos enviado un enlace de recuperación a tu correo electrónico.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al procesar la solicitud"
        });
    }
});

// Ruta para eliminar usuarios
router.delete('/:id', validateAuth, async (req, res) => {
    // Validar que el usuario sea admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }

    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        res.json({
            success: true,
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario"
        });
    }
});

export default router;