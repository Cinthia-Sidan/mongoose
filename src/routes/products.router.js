const {Router} = require("express");
const {productModel} = require("../models/products.model");
const { route } = require("./users.router");
const router = Router();


router.get("/", async(req, res)=>{
    try{
        let products = await productModel.find()
        res.send({result:"success", payload: products})
    }catch(error){
        console.log(error);
    }
})

router.post("/", async (req, res) =>{
    let{nombre, stock, precio, descripcion} = req.body

    if(!nombre || !stock || !precio || !descripcion){
        res.send({status: "error", error: "Faltan campos obligatorios"})
    }

    let result = await productModel.create({nombre,stock,precio,descripcion})
    res.send({result: "success", payload: result})
})

router.put("/:pid", async (req,res) =>{
    let {pid} = req.params

    let productToReplace = req.body

    if(!productToReplace.nombre || !productToReplace.stock || !productToReplace.precio || !productToReplace.descripcion){
        res.send({status: "error", error: "Faltan campos obligatorios"})
    }

    let result = await productModel.updateOne({_id:pid}, productToReplace)
    res.send({result: "success", payload: result})

})

router.delete("/:pid", async (req, res)=>{
    let {pid} = req.params

    let result = await productModel.deleteOne({_id: pid})
    res.send({result: "success", payload: result})
})

module.exports = router;