const express = require("express");
const { errorHandlerMiddleware } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/not-found");
const { sampleBooks } = require("./constants/books");

const sqlite3 = require("sqlite3").verbose();
const { serveSwagger, setupSwagger } = require("./config/swagger");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const bookStore = require("./routes/books");
const authRouter = require("./routes/auth");
const authenticateUser = require("./middleware/authentication");

const App = express();

//config
require("dotenv").config();
App.use(express.json());
App.use(helmet());
App.use(cors());
App.use(xss());

//db
const db = new sqlite3.Database("db/bookstore.db");

db.run(
  `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    author TEXT,
    lastPageRead INTEGER
  )
`,
  (err) => {
    if (err) {
      throw new Error(err.message);
    }
  }
);

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    password TEXT
  )
`);

// Insert sample books into the database
db.get(
  `
  SELECT COUNT(*) as count FROM books
`,
  (err, row) => {
    if (err) {
      throw new Error(err.message);
    }

    if (row.count === 0) {
      sampleBooks.forEach((book) => {
        db.run(
          `
            INSERT INTO books (title, content, author, lastPageRead)
            VALUES (?, ?, ?, ?)
          `,
          [book.title, book.content, book.author, book.lastPageRead],
          (err) => {
            if (err) {
              console.error(err.message);
            }
          }
        );
      });
    }
  }
);

// Swagger setup
/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               books:
 *                 - id: 1
 *                   title: "The Great Gatsby"
 *                   author: "F. Scott Fitzgerald"
 *                   content: "A classic novel by F. Scott Fitzgerald."
 *                   lastPageRead: 100
 *                 - id: 2
 *                   title: "To Kill a Mockingbird"
 *                   author: "Harper Lee"
 *                   content: "A novel by Harper Lee."
 *                   lastPageRead: 150
 *
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a specific book by its ID
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: ID of the book
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "The Great Gatsby"
 *               author: "F. Scott Fitzgerald"
 *       '404':
 *         description: Book not found
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate a JWT token
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: payload
 *         in: body
 *         description: User Credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiY2h1a3VyYTFAZ21haWwuY29tIiwiaWF0IjoxNzA3OTg3NjA3LCJleHAiOjE3MDgwNzQwMDd9.9qshg0cAadDtpneEhfZGDzorY5ZKBSZYErXLF8sXoDI"
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User register
 *     description: Register new user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: payload
 *         in: body
 *         description: User Credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Remove a specific book by its ID
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: ID of the book to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               deletedBookId: 1
 *       '404':
 *         description: Book not found
 */

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Add a new book
 *     description: Add a new book to the bookstore
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - name: payload
 *         in: body
 *         description: User Credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *            title:
 *              type: string
 *            author:
 *              type: string
 *            content:
 *              type: string
 *            lastPageRead:
 *              type: number
 *     consumes:
 *      - application/json
 *     responses:
 *       '201':
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               title: "New Book"
 *               author: "Author Name"
 *       '400':
 *         description: Bad request (missing or invalid data)
 */

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     description: Update the details of a specific book by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the book to update
 *         required: true
 *         schema:
 *           type: integer
 *       - name: title
 *         in: body
 *         description: update desired properties
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *            title:
 *              type: string
 *            author:
 *              type: string
 *            content:
 *              type: string
 *            lastPageRead:
 *              type: number
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Updated Title"
 *               author: "Updated Author"
 *       '404':
 *         description: Book not found
 */

App.use("/api-docs", serveSwagger, setupSwagger);

//routes
App.use("/api/v1/books", authenticateUser, bookStore.router);
App.use("/api/v1/auth", authRouter.router);

//middlewares
App.use(errorHandlerMiddleware);
App.use(notFound);

const port = process.env.PORT || 3000;
App.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = App;
