const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const lotsController = require("../controllers/lotsController");

router.get("/", authUser.isAdmOrOp, lotsController.showLots);

router.get(
  "/showProduct/:id",
  authUser.isAdmOrOp,
  lotsController.showProductsInLots
);

router.get("/add", authUser.isAdmOrOp, (req, res) => {
  res.render("administration/lots/addLot", {
    title: "Añadir lote",
  });
});

router.post("/add", authUser.isAdmOrOp, lotsController.AddLot);

module.exports = router;
