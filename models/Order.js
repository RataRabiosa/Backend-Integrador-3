import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    products: [
        {
            id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product',
                required: true 
            },
            name: { 
                type: String, 
                required: [true, 'El nombre del producto es requerido'] 
            },
            description: { 
                type: String 
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: [1, 'La cantidad no puede ser menor que 1'] 
            },
            price: { 
                type: Number, 
                required: true 
            },
            subtotal: { 
                type: Number, 
                required: true 
            }
        }
    ],
    totalItems: { 
        type: Number, 
        default: 0 
    },
    totalPrice: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;