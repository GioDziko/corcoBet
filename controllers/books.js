const { StatusCodes } = require("http-status-codes");
const { createNotFoundError } = require("../errors/not-found");
const { createBadRequestError } = require("../errors/bad-request");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/bookstore.db");

const getAllBooks = (req, res) => {
  db.all("SELECT * FROM books", (err, data) => {
    if (err) {
      next(new Error(err.message));
    } else {
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    }
  });
};

const getBookById = (req, res, next) => {
  const bookId = parseInt(req.params.id);
  if (!bookId) {
    throw createBadRequestError("please provide correct bookID");
  }

  db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, data) => {
    if (err) {
      next(new Error(err.message));
    } else if (data) {
      res.json({ success: true, data });
    } else {
      next(createNotFoundError("Book not found"));
    }
  });
};
const deleteById = (req, res, next) => {
  const bookId = parseInt(req.params.id);

  if (!bookId) {
    return next(createBadRequestError("please provide correct bookID"));
  }

  db.run("DELETE FROM books WHERE id = ?", [bookId], function (err) {
    if (err) {
      return next(new Error(err.message));
    }
    if (this.changes) {
      return res.status(201).json({ success: true, data: { bookId } });
    }
    return next(createNotFoundError("Book not found"));
  });
};
const addNewBook = (req, res, next) => {
  const { title, author, content, lastPageRead } = req.body;

  if (!title || !author || !content || !lastPageRead) {
    return next(
      createBadRequestError(
        "please provide title,author,content and lastPageRead"
      )
    );
  }

  db.run(
    "INSERT INTO books (title, content,author,lastPageRead) VALUES (?,?,?,?)",
    [title, content, author, lastPageRead],
    function (err) {
      if (err) {
        return next(new Error(err.message));
      }

      const newBookId = this.lastID;

      res.status(201).json({
        success: true,
        data: {
          id: newBookId,
        },
      });
    }
  );
};

const updateBook = (req, res, next) => {
  const bookId = parseInt(req.params.id);
  const { title, author, content, lastPageRead } = req.body;

  if (!bookId) {
    throw createBadRequestError("please provide correct bookID");
  }
  if (title || author || content || lastPageRead) {
    db.run(
      "UPDATE books SET lastPageRead = COALESCE(?, lastPageRead), content = COALESCE(?, content), title = COALESCE(?, title), author = COALESCE(?, author) WHERE id = ?",
      [lastPageRead, content, title, author, bookId],
      function (err) {
        if (err) {
          return next(new Error(err.message));
        }

        if (this.changes === 0) {
          return next(createNotFoundError("Book not found"));
        }

        console.log(this);
        res.status(200).json({
          success: true,
          id: bookId,
        });
      }
    );
  } else {
    return next(
      createBadRequestError(
        "Bad request. At least one field (title, author, content or lastPageRead) should be provided for update."
      )
    );
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  deleteById,
  addNewBook,
  updateBook,
};
