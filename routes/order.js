import express from 'express';
import Order from '../models/Order.js';
import validateAuth from '../middelwares/auth.js';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import gmail from '../config/mail.js';

const router = express.Router();

// Validar campos para la orden
const orderValidation = [
    body('products').isArray().withMessage('Products debe ser un arreglo.'),
    body('products.*.id').notEmpty().withMessage('El id del producto es requerido.'),
    body('products.*.name').notEmpty().withMessage('El nombre del producto es requerido.'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor o igual a 1.'),
    body('products.*.price').isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor o igual a 0.01.'),
    body('products.*.subtotal').isFloat({ min: 0.01 }).withMessage('El subtotal debe ser un número mayor o igual a 0.01.'),
    body('totalItems').isInt({ min: 1 }).withMessage('totalItems debe ser un número entero mayor o igual a 1.'),
    body('totalPrice').isFloat({ min: 0.01 }).withMessage('totalPrice debe ser un número mayor o igual a 0.01.'),
];

// Formato de correo
const emailFormat = {
    from: "mercadopresosrl@gmail.com",
    to: "",
    subject: "",
    html: ""
}

// Listar todas las ordenes
router.get('/all', validateAuth, async (req, res) => {
    // Validar que el usuario sea admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }

    const orders = await Order.find();
    res.json({
        success: true,
        data: orders
    });
});

// Listar ordenes del usuario autenticado
router.get('/', validateAuth, async (req, res) => {
    const orders = await Order.find({ userId: req.user.userdata._id });
    res.json({
        success: true,
        data: orders
    });
});

// Crear una nueva orden
router.post('/', validateAuth, orderValidation, async (req, res) => {
    // Validar los campos de la orden
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { products, totalItems, totalPrice } = req.body;

    const newOrder = new Order({
        userId: req.user.userdata._id,
        products,
        totalItems,
        totalPrice
    });

    try {
        const savedOrder = await newOrder.save();

        // descontar el stock de los productos ordenados
        for (const item of products) {
            const product = await Product.findById(item.id);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }
        // Enviar correo de confirmacion al usuario
        const userEmail = req.user.userdata.email;
        emailFormat.to = userEmail;
        emailFormat.subject = `Confirmación de Orden #${savedOrder._id}`;
        let productListHtml = '<ul>';
        products.forEach(item => {
            productListHtml += `<li>${item.quantity}x ${item.name} - $${item.price}</li>`;
        });
        productListHtml += '</ul>';

        emailFormat.html = `
            <h1>Gracias por tu compra!</h1>
            <p>Hemos recibido tu orden con los siguientes detalles:</p>
            ${productListHtml}
            <p><b>Total de artículos:</b> ${totalItems}</p>
            <p><b>Total a pagar:</b> $${totalPrice.toFixed(2)}</p>
            <p>Tu orden será procesada pronto.</p>
            <br/>
            <p>Atentamente,</p>
            <p>El equipo de MercadoPreso</p>
        `;
        await gmail.sendMail(emailFormat);

        res.status(201).json({
            success: true,
            data: savedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});
export default router;