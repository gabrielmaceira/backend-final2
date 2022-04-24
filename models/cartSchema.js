import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    timestamp: {type: Date, required: true}
})

const cartModel = mongoose.model('Carrito', cartSchema)

export default cartModel