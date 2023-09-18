const {Router} = require("express");
const {cartModel} = require("../models/cart.model")
const { route } = require("./products.router")
const router = Router();

router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartModel
            .findById(req.params.cid)
            .populate("products.product"); 

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los productos del carrito" });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar que quantity sea un número positivo
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser un número positivo." });
        }

        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        // Agregar el producto al carrito con la cantidad especificada
        const newProduct = {
            product: pid,
            quantity: parsedQuantity,
        };

        cart.products.push(newProduct);
        await cart.save(); // Guardar los cambios en el carrito

        res.status(201).json({ message: "Producto agregado al carrito con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar el producto al carrito." });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        // Reemplazar el arreglo de productos del carrito con el nuevo arreglo
        cart.products = products;

        // Guardar los cambios en el carrito
        await cart.save();

        res.json(cart);
     } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el carrito con el arreglo de productos." });
        }
});



router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar que quantity sea un número positivo
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser un número positivo." });
        }

        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        // Encontrar el producto específico en el arreglo de productos del carrito
        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito." });
        }

        // Actualizar la cantidad del producto
        cart.products[productIndex].quantity = parsedQuantity;

        // Guardar los cambios en el carrito
        await cart.save();

        res.json(cart); // Enviar el carrito actualizado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito." });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        // Encontrar el producto específico en el arreglo de productos del carrito
        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito." });
        }

        // Eliminar el producto del arreglo de productos
        cart.products.splice(productIndex, 1);

        // Guardar los cambios en el carrito
        await cart.save();

        res.json(cart); // Enviar el carrito actualizado como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el producto del carrito." });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        // Eliminar todos los productos del carrito
        cart.products = []; // Opcionalmente, puedes usar cart.products.splice(0, cart.products.length);

        // Guardar los cambios en el carrito
        await cart.save();

        res.json(cart); // Enviar el carrito actualizado (sin productos) como respuesta
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar todos los productos del carrito." });
    }
});
