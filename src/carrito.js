const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Base de datos simulada para almacenar los carritos
let carritos = [];

// Función para generar un ID único
function generarID() {
    return Math.random().toString(36).substr(2, 9);
}

// Ruta para crear un nuevo carrito
app.post('/api/carts', (req, res) => {
    const newCart = {
        id: generarID(),
        products: []
    };
    carritos.push(newCart);
    res.json(newCart);
});

// Ruta para obtener los productos de un carrito específico
app.get('/api/carts/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carritos.find(cart => cart.id === cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

// Ruta para agregar un producto a un carrito específico
app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = carritos.find(cart => cart.id === cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(product => product.id === pid);
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
    } else {
        cart.products.push({ id: pid, quantity: parseInt(quantity) });
    }

    res.json(cart.products);
});

// Puerto en el que escucha el servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
