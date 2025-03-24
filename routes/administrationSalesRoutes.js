const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const salesController = require("../controllers/salesController");

router.get("/", (req, res) => {
  res.render("administration/sales/menuSales", {
    title: "Ventas",
  });
});

module.exports = router;

router.post("/scan", (req, res) => {
  const { scannedData } = req.body;

  if (!scannedData || scannedData.length === 0) {
    return res.status(400).json({ message: "No se recibieron datos" });
  }

  console.log("Datos escaneados recibidos:", scannedData);

  // Aquí puedes agregar lógica para guardar en la base de datos si es necesario

  res.json({ message: "Datos recibidos correctamente" });
});
