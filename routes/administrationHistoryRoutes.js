const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const historyController = require("../controllers/historyController");

router.get("/", authUser.isAdmin, (req, res) => {
  res.render("administration/history/historyMenu", {
    title: "Historial",
  });
});

router.get("/edited", authUser.isAdmin, historyController.showAllEdited);

router.get("/sales", authUser.isAdmin, (req, res) => {
  res.render("administration/history/historySales", {
    title: "Historial de ventas",
  });
});
router.get("/removed", authUser.isAdmin, historyController.showAllDeleted);

router.get("/edited/delete/:id", authUser.isAdmin, historyController.deleteEdited)

router.get("/removed/delete/:id", authUser.isAdmin, historyController.deleteRemoved)


module.exports = router;
