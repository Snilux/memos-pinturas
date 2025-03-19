const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const providersController = require("../controllers/providerController");

router.get("/", authUser.isAdmOrOp, providersController.showProviders);

router.get("/add", authUser.isAdmOrOp, (req, res) => {
  res.render("administration/providers/addProvider", {
    title: "Agregar proveedor",
  });
});

router.post("/add", authUser.isAdmOrOp, providersController.addProviders);

router.get("/edit/:id", authUser.isAdmOrOp, providersController.editProvider);

router.post("/save/:id", authUser.isAdmOrOp, providersController.saveProvider);

router.get('/delete/:id', authUser.isAdmOrOp, providersController.deleteProvider)

module.exports = router;
