const { Router } = require("express");
const { productModel } = require("../models/products.model");
const { route } = require("./users.router");
const router = Router();


router.get("/", async (req, res) => {
    try {
        //Obtengo los query params
        const { limit = 10, page = 1, sort, query } = req.query;

        //Convierto limit y page en números enteros
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        // Construye el objeto de opciones para la consulta a la base de datos
        const options = {};

        // Establece la opción "limit" si se proporciona
        if (!isNaN(limitInt) && limitInt > 0) {
            options.limit = limitInt;
        }

        // Establece la opción "skip" para la paginación si page es mayor que 1
        if (!isNaN(pageInt) && pageInt > 1) {
            options.page = pageInt;
        }

        // Establece la opción "sort" si se proporciona y es "asc" o "desc"
        if (sort && (sort === "asc" || sort === "desc")) {
            options.sort = { precio: sort === "asc" ? 1 : -1 };
        }

        // Construye la consulta para buscar productos con filtrado opcional
        const queryObj = {};
        if (query) {
            // Aquí puedes definir cómo deseas filtrar los productos
            // Por ejemplo, puedes buscar por nombre o descripción
            queryObj.$or = [
                { nombre: { $regex: query, $options: "i" } }, // Búsqueda insensible a mayúsculas y minúsculas
                { descripcion: { $regex: query, $options: "i" } },
            ];
        }

        // Combina la consulta principal con el filtrado opcional
        const mainQuery = queryObj.$or ? { ...queryObj } : {};

        // Utiliza el método paginate del modelo con las opciones configuradas
        const products = await productModel.paginate(mainQuery, options);



        res.send({
            result: "success", 
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage || null,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/", async (req, res) => {
    let { nombre, stock, precio, descripcion } = req.body

    if (!nombre || !stock || !precio || !descripcion) {
        res.send({ status: "error", error: "Faltan campos obligatorios" })
    }

    let result = await productModel.create({ nombre, stock, precio, descripcion })
    res.send({ result: "success", payload: result })
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params

    let productToReplace = req.body

    if (!productToReplace.nombre || !productToReplace.stock || !productToReplace.precio || !productToReplace.descripcion) {
        res.send({ status: "error", error: "Faltan campos obligatorios" })
    }

    let result = await productModel.updateOne({ _id: pid }, productToReplace)
    res.send({ result: "success", payload: result })

})

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params

    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

module.exports = router;