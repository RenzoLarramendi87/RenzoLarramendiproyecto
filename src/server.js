import express from 'express';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Middleware para parsear el body de las peticiones
app.use(bodyParser.json());

// Base de datos de ejemplo (simulada)
let productsDB = [];

// Rutas para productos
const productsRouter = express.Router();

// Listar todos los productos
productsRouter.get('/', (req, res) => {
    const limit = req.query.limit || productsDB.length;
    res.json(productsDB.slice(0, limit));
});

// Obtener un producto por su id
productsRouter.get('/:pid', (req, res) => {
    const product = productsDB.find(prod => prod.id === req.params.pid);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json(product);
    }
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
    } else {
        newProduct.status = true; // Establecer por defecto
        productsDB.push(newProduct);
        res.status(201).json(newProduct);
    }
});

// Actualizar un producto por su id
productsRouter.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const index = productsDB.findIndex(prod => prod.id === productId);
    if (index === -1) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        productsDB[index] = { ...productsDB[index], ...updatedProduct };
        res.json(productsDB[index]);
    }
});

// Eliminar un producto por su id
productsRouter.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    productsDB = productsDB.filter(prod => prod.id !== productId);
    res.sendStatus(204);
});

// Montar el router de productos en la ruta /api/products
app.use('/api/products', productsRouter);

// Rutas para carritos (a implementar según sea necesario)

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
