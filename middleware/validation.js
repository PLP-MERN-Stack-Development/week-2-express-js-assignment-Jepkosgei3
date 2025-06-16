const { ValidationError } = require('../utils/errors');

function validateProduct(req, res, next) {
  const { name, price, category } = req.body;
  
  // Skip validation for empty PUT requests
  if (req.method === 'PUT' && Object.keys(req.body).length === 0) {
    return next(new ValidationError('No fields provided for update'));
  }

  // Only validate name if it's being modified (POST or PUT with name)
  if (name && typeof name !== 'string') {
    return next(new ValidationError('Name must be a string'));
  }
  
  // Similar for other fields
  if (price && (typeof price !== 'number' || price <= 0)) {
    return next(new ValidationError('Price must be a positive number'));
  }
  
  // Category only required for new products
  if ((req.method === 'POST') && (!category || typeof category !== 'string')) {
    return next(new ValidationError('Category is required'));
  }
  
  
  next();
};

module.exports = { validateProduct };