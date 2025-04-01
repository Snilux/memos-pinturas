const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const historyController = require("../controllers/historyController");

router.get("/", authUser.isAdmin, historyController.showMenu);

router.get("/edited", authUser.isAdmin, historyController.showAllEdited);

router.get("/sales", authUser.isAdmin, historyController.showSales);

router.get("/sales/showProducts/:id", authUser.isAdmin, historyController.showProductsInSales);

router.get("/removed", authUser.isAdmin, historyController.showAllDeleted);

router.get(
  "/edited/delete/:id",
  authUser.isAdmin,
  historyController.deleteEdited
);

router.get(
  "/removed/delete/:id",
  authUser.isAdmin,
  historyController.deleteRemoved
);

module.exports = router;
