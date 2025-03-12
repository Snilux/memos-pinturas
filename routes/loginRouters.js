const express = require("express");
const router = express.Router();
const authController = require("../controllers/usersController");

router.get("/", (req, res) => {
  res.render("login", { title: "Iniciar sesión" });
});

router.post("/", authController.login);

router.get("/recoveryPass", (req, res) => {
  res.render("recoveryPass", { title: "Recuperar contraseña" });
});

router.post("/recoveryPass", authController.recoveryPass);

module.exports = router;
