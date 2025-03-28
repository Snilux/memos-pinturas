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

router.get(
  "/generateCode/:id/:month/:year",
  authUser.isAdmOrOp,
  lotsController.generateCode
);

router.get("/verifyTag/:id", authUser.isAdmOrOp, lotsController.verifyTag);

router.get("/generateTag/:id", authUser.isAdmOrOp, lotsController.generateTag);

router.get("/edit/:id/:provider", authUser.isAdmOrOp, lotsController.editLot);

router.post("/edit/:id", authUser.isAdmOrOp, lotsController.saveLot);

router.get("/delete/:id", authUser.isAdmOrOp, lotsController.deleteLot);

module.exports = router;
