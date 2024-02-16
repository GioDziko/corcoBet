const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  deleteById,
  addNewBook,
  updateBook,
} = require("../controllers/books");

router.route("/").get(getAllBooks).post(addNewBook);
router.route("/:id").get(getBookById).delete(deleteById).put(updateBook);

module.exports = { router };
