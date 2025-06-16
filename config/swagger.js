const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description: 'API for managing products with CRUD operations',
    },
      
    servers: [
      {
        url: 'https://orange-spoon-wq79wvgqvjq39pv7-3000.app.github.dev/api/', // Note the /api
        description: 'GitHub Codespace server (with /api prefix)'
      },
      {
        url: 'http://localhost:3000/api', // Also update local if needed
        description: 'Local server (with /api prefix)'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            id: {
              type: 'string',
              example: '64d5a9f2a3b5e6f7a8b9c0d1'
            },
            name: {
              type: 'string',
              example: 'Smartphone'
            },
            category: {
              type: 'string',
              example: 'Electronics'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 599.99
            },
            description: {
              type: 'string',
              example: 'Latest model with advanced features'
            },
            inStock: {
              type: 'boolean',
              example: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Product not found'
            },
            statusCode: {
              type: 'integer',
              example: 404
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};