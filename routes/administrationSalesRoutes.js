const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const salesController = require("../controllers/salesController");

router.get("/", authUser.isAdmOrOp, (req, res) => {
  res.render("administration/sales/menuSales", {
    title: "Ventas",
  });
});

router.get(
  "/api/products/find-by-code/:code",
  authUser.isAdmOrOp,
  salesController.findByCode
);

router.post("/api/finalize", authUser.isAdmOrOp, salesController.finalizeSale);

module.exports = router;
