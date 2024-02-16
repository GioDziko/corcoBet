const express = require("express");
const router = express.Router();
const { register, getall, login } = require("../controllers/auth");

router.post("/register", register);
router.get("/get", getall);
router.post("/login", login);

module.exports = { router };
