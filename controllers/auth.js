const { StatusCodes } = require("http-status-codes");
const { createBadRequestError } = require("../errors/bad-request");
const { createUnauthenticatedError } = require("../errors/unauthenticated");
const bcrypt = require("bcryptjs");
const { comparePassword, createJWT } = require("../utils/auth");
const { createNotFoundError } = require("../errors/not-found");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/bookstore.db");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!email || !password) {
    return next(createBadRequestError("please provide credentials"));
  }

  if (!emailPattern.test(email)) {
    return next(createBadRequestError("please provide correct email"));
  }

  db.get(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (err, data) => {
      if (err) {
        next(new Error(err.message));
      } else if (data) {
        return next(createBadRequestError(`user ${email} already exists`));
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        db.run(
          `
         INSERT INTO users (email,password)
         VALUES(?, ?)
        `,
          [email, hashedPassword],
          (err) => {
            if (err) {
              return next(createBadRequestError(err.message));
            }
            return res.status(StatusCodes.CREATED).json({ success: true });
          }
        );
      }
    }
  );
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createBadRequestError("Please provide email and password"));
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      next(new Error(err.message));
    } else if (user) {
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (isPasswordCorrect) {
        const token = createJWT(user);
        return res.status(StatusCodes.OK).json({ success: true, data: token });
      } else {
        next(createUnauthenticatedError("Invalid Credentials"));
      }
    } else {
      next(createNotFoundError("Invalid Credentials"));
    }
  });
};

const getall = async (req, res) => {
  db.all("SELECT * FROM users", (err, data) => {
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

module.exports = {
  register,
  getall,
  login,
};
