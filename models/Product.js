import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre del producto es requerido"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "El precio es requerido"],
            min: [0, "El precio debe ser mayor o igual a 0"],
        },
        stock: {
            type: Number,
            required: [true, "El stock es requerido"],
            min: [0, "El stock debe ser mayor o igual a 0"],
        },
        category: {
            type: String,
            required: [true, "La categoría es requerida"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "La imagen es requerida"],
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                // Agregar campo id numérico para compatibilidad con frontend
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
