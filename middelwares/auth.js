import jwt from 'jsonwebtoken';

const validateAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Verificar que el header existe y empieza con 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Usuario no autenticado, por favor inicie sesión.' });
    }

    // 2. Extraer el token de forma segura
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Esto captura tokens expirados, mal formados o desajustes de secreto
            return res.status(403).json({ mensaje: 'Token no valido o expirado' });
        }

        // 3. Inicializar req.user y asignar datos
        req.user = { userdata: decoded.id }; 
        //console.log(req.user)
        next();
    });
}

export default validateAuth;