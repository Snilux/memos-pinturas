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

module.exports = router;
