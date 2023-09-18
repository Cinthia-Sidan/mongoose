const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./routes/users.router");
const productRouter = require("./routes/products.router");
const { userModel } = require('./models/user.model');
const app = express();
const port =8080;


app.listen(port, () =>{
    console.log(`Server is runnin on port ${port}`);
});

app.use(express.json())

// mongoose.connect('mongodb+srv://sidanusp:120722@cluster0.j4eyswf.mongodb.net/?retryWrites=true&w=majority')

// .then(()=>{
//     console.log("Conectado");
// })

// .catch(error =>{
//     console.error("Error en la conexion", error);
// })

const enviroment = async() =>{
    await mongoose.connect('mongodb+srv://sidanusp:120722@cluster0.j4eyswf.mongodb.net/?retryWrites=true&w=majority')

    //let response = await userModel.find().explain("executionStatus");

    console.log("Conectado a la base de datos");
}

enviroment()

app.use("/api/users", userRouter)

app.use("/api/products", productRouter)