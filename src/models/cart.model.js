const mongoose = require("mongoose");

const cartCollection = "carritos";

const cartSchema = new mongoose.Schema({
    products:[{
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "productos"
                },
                quantity:{type: Number, default: 1}
            }
        ],
        default: []
    }],
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel