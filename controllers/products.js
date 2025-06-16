const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');

let products = [
  {
    id: '1',
    name: 'MacBook Pro',
    description: '16-inch, M3 Pro chip',
    price: 2499.99,
    category: 'Electronics',
    inStock: true
  }
];

// Helper function for ASCII table format
const generateAsciiTable = (productList) => {
  let table = '+--------+---------------------+---------------+-----------+----------+\n';
  table += '| ID     | Name                | Category      | Price     | In Stock |\n';
  table += '+--------+---------------------+---------------+-----------+----------+\n';
  
  productList.forEach(p => {
    table += `| ${p.id.substring(0, 6)}... | ${p.name.padEnd(19)} | ${p.category.padEnd(13)} | $${p.price.toFixed(2).padStart(8)} | ${p.inStock ? '✓'.padEnd(8) : '✗'.padEnd(8)} |\n`;
  });
  
  table += '+--------+---------------------+---------------+-----------+----------+';
  return table;
};

// Helper function for HTML table format
const generateHtmlTable = (productList) => {
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Products</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #f2f2f2; }
      tr:hover { background-color: #f5f5f5; }
      .in-stock { color: green; }
      .out-of-stock { color: red; }
    </style>
  </head>
  <body>
    <h2>Products</h2>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
        <th>Category</th>
        <th>Price</th>
        <th>In Stock</th>
      </tr>
  `;
  
  productList.forEach(p => {
    html += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${p.category}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td class="${p.inStock ? 'in-stock' : 'out-of-stock'}">
          ${p.inStock ? '✓' : '✗'}
        </td>
      </tr>
    `;
  });
  
  html += `</table></body></html>`;
  return html;
};

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let filteredProducts = [...products];
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    if (req.query.inStock) {
      filteredProducts = filteredProducts.filter(
        p => p.inStock === (req.query.inStock === 'true')
      );
    }

    const results = filteredProducts.slice(startIndex, startIndex + limit);

    // Format response based on Accept header
    if (req.accepts('text/html')) {
      res.send(generateHtmlTable(results));
    } else if (req.accepts('text/plain')) {
      res.type('text').send(generateAsciiTable(results));
    } else {
      res.json({
        total: filteredProducts.length,
        page,
        pages: Math.ceil(filteredProducts.length / limit),
        products: results
      });
    }
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (req.accepts('text/html')) {
      res.send(generateHtmlTable([product]));
    } else if (req.accepts('text/plain')) {
      res.type('text').send(generateAsciiTable([product]));
    } else {
      res.json(product);
    }
  } catch (err) {
    next(err);
  }
};

// Other controller functions remain the same
const createProduct = async (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const results = products.filter(
      p => p.name.toLowerCase().includes(query) || 
           p.description.toLowerCase().includes(query)
    );

    if (req.accepts('text/html')) {
      res.send(generateHtmlTable(results));
    } else if (req.accepts('text/plain')) {
      res.type('text').send(generateAsciiTable(results));
    } else {
      res.json(results);
    }
  } catch (err) {
    next(err);
  }
};

const getProductStats = async (req, res, next) => {
  try {
    const stats = {
      totalProducts: products.length,
      byCategory: {},
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0
    };

    products.forEach(p => {
      stats.byCategory[p.category] = (stats.byCategory[p.category] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats,
  products // Exporting for testing purposes
};