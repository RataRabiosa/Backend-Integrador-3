import express from 'express';
import Product from '../models/Product.js';
import { body, validationResult } from 'express-validator';
import validateAuth from '../middelwares/auth.js';

const router = express.Router();

// Validar campos para registro
const productValidation = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
    body('category').notEmpty().withMessage('La categoría es requerida'),
    body('image').notEmpty().withMessage('La imagen es requerida'),
];

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json({
        success: true,
        data: products
    });
});

// Ruta para obtener producto especifico por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Producto no encontrado"
        });
    }
    res.json({
        success: true,
        data: product
    });
});

// Ruta para añadir nuevos productos
router.post('/', validateAuth, productValidation, async (req, res) => {

    // Validar que el usuario tenga permisos admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }
    const { name, price, description, stock, category, image } = req.body;

    const newProduct = new Product({
        name,
        price,
        description,
        stock,
        category,
        image
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({
            success: true,
            data: savedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al crear el producto"
        });
    }
});

// Ruta para actualizar productos por id
router.patch('/:id', validateAuth, productValidation, async (req, res) => {

    // Validar que el usuario sea admin
    if (!req.user.userdata.userRole || req.user.userdata.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }

    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto"
        });
    }
})

// Ruta para borrar productos por id
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
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        res.json({
            success: true,
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto"
        });
    }
});

export default router;