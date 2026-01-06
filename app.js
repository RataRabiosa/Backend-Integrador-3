import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import users from './routes/users.js';
import products from './routes/products.js';
import orders from './routes/order.js';

// Conectar a la base de datos
connectDB();

// Configurar el puerto predeterminado
const defaultPort = process.env.HTTP_PORT || 3000;

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para usar CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

// Rutas
app.use('/api/v1/user', users);
app.use('/api/v1/product', products);
app.use('/api/v1/order', orders);

// Iniciar el servidor
app.listen(defaultPort, () => {
  console.log(`Servidor escuchando en el puerto ${defaultPort}`);
});