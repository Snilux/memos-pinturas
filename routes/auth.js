const express = require("express");
const router = express.Router();
const authController = require("../controllers/authLoginController");

router.post("/login", authController.login); 

module.exports = router;
