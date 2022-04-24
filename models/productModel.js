import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    codigo: {type: String, required: true},
    foto: {type: String, required: true},
    precio: {type: Number, required: true, min: [0, "Min price is 0"]},
    stock: {type: Number, required: true, min: [0, "Min price is 0"]},
})

const productModel = mongoose.model('Producto', productSchema)

export default productModel