const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');
const setupSwagger = require('./config/swagger');

const app = express();

// ======================
// Middleware
// ======================
app.use(bodyParser.json());
app.use(logger);
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// ======================
// Swagger Documentation
// ======================
setupSwagger(app);

// ======================
// Routes
// ======================
// API Routes
app.use('/api/products', require('./routes/products'));

// Debug Endpoint (kept as-is)
app.get('/debug', (req, res) => {
  const products = require('./controllers/products').products;
  res.json({ 
    productsExist: products && products.length > 0,
    products 
  });
});

// Dual-Purpose Root Route
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.json({ message: 'Hello World' });
  }
});

// ======================
// Error Handling (must be last)
// ======================
app.use(errorHandler);

module.exports = app;