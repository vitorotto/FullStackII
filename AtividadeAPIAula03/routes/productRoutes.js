import express from "express";

import products from "../db/products.js";
import authMiddleware from "../middlewares/auth.js";
import validateProductDTO from "../middlewares/validateProductDTO.js";
import validateUserRole from "../middlewares/validateRole.js";

const ProductRouter = express.Router();

class ProductService {
    findByName(name) {
        return products.find(p => p.name === name);
    }

    findById(id) {
        return products.find(p => p.id === id);
    }

    delete(id) {
        const index = products.findIndex(p => p.id === id);
        products.splice(index, 1);
    };
}

const productService = new ProductService;

// Rota para aplicar filtros
ProductRouter.get('/filter', (req, res) => {
    const filterName = req.query.name;
    const moreExpensive = req.query.moreExpensive
    const moreCheaper = req.query.moreCheaper
    const filterQuant = req.query.quant;

    // Aplicando filtros se eles existirem
    let filteredProducts = [...products];

    if (filterName) {
        filteredProducts = filteredProducts.filter(pr => pr.name.toLowerCase().includes(filterName.toLowerCase()));
    }

    if (moreExpensive) {
        filteredProducts = filteredProducts.filter(pr => Number(pr.price) >= moreExpensive);
    }

    if (moreCheaper) {
        filteredProducts = filteredProducts.filter(pr => Number(pr.price) <= moreCheaper);
    }

    if (filterQuant) {
        filteredProducts = filteredProducts.filter(pr => Number(pr.qnt) <= filterQuant);
    }

    if (filteredProducts.length === 0) 
        res.status(404).json({ message: "Lamentamos, mas nenhum produto foi encontrado" })
    else
        res.status(200).json({ products: filteredProducts });
})

// Rota para buscar produto pelo ID
ProductRouter.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id) res.status(200).json({ message: "Id não encontrado" });

    try {
        const product = productService.findById(id);
        if (!product) res.status(404).json({ message: "Produto não encontrado" });
        res.status(200).json({ product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
})

// Rota para listar todos os produtos
ProductRouter.get('/', (req, res) => {
    try {
        const data = products;
        res.status(200).json({ products: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Houve algum erro no servidor" });
    }
})

ProductRouter.use(authMiddleware, validateUserRole);

// Rota para criar produto
ProductRouter.post('/', validateProductDTO, (req, res) => {
    const data = { ...req.body };

    // Verificando se o produto já existe
    const existingProduct = productService.findByName(data.name)
    if (existingProduct) res.status(400).json({ message: "Nome já cadastrado!" });

    const id = products.length + 1;
    // Aumentar o número do id enquanto existir um valor igual
    let currentId = id;
    while (productService.findById(currentId.toString())) {
        currentId++;
    }

    console.log(id)
    const product = { ...data, id: currentId.toString() };

    try {
        products.push(product);
        res.status(201).json({ message: 'Produto criado com sucesso', product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
})

// Rota para atualizar os dados do produto
ProductRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) res.status(404).json({ message: "Id não encontrado" });
    const newData = req.body;
    try {
        let product = productService.findById(id);
        if (!product) res.status(404).json({ message: "Produto não encontrado" });
        product = { ...product, ...newData };
        const index = products.findIndex(i => i.id === id);
        products[index] = product;
        res.status(200).json({ message: "Produto editado com sucesso", product: products[index] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Deu PT... É 13" });
    }
})

// Rota para deletar produto
ProductRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    try {
        const product = productService.findById(id);
        if (!product) res.status(404).json({ message: "Produto não encontrado" });
        productService.delete(id);
        res.status(200).json({ message: "Produto deletado com sucesso", name: product.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" })
    }
})

export default ProductRouter;