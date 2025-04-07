const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
/* GET home page. */
router.get("/", indexController.getRandomProducts);

router.get("/products", indexController.getAllRandomProducts);

router.get("/location", (req, res) => {
  res.render("location", {
    title: "Ubicación",
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contacto",
  });
});

router.post("/contact", indexController.sendContact);

router.get("/products/searchProduct", indexController.searchAllProducts);

router.get("/products/searchProducts", indexController.searchProducts)

module.exports = router;
