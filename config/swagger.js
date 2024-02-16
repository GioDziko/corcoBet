const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Bookstore API",
      version: "1.0.0",
      description: "API for managing books in a bookstore",
    },
  },
  apis: ["app.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {
  serveSwagger: swaggerUI.serve,
  setupSwagger: swaggerUI.setup(swaggerSpec),
};
