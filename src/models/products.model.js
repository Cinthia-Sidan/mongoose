const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const productCollection = "productos";

const productSchema = new mongoose.Schema({
    nombre:{type: String, required: true, max: 400 },
    stock:{type: Number, required: true, max: 10 },
    precio:{type: Number, required: true, max: 1000000 },
    descripcion:{type: String, required: true, max: 1000 }
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productCollection, productSchema)

module.exports = {productModel};