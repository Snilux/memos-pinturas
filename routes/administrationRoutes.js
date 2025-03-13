const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const authUser = require("../middlewares/authUser");
const upload = require("../middlewares/multerConfig");

router.get("/", authUser.isAdmOrOp, (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.render("administration/panelAdministration", {
    title: `Panel de administracion`,
    data: req.session.user,
  });
});
router.get("/products", authUser.isAdmOrOp, productsController.ShowAllProducts);

router.get("/products/add", authUser.isAdmOrOp, (req, res, next) => {
  res.render("administration/products/addProduct", {
    title: `Añadir productos`,
    data: req.session.user,
  });
});

router.post(
  "/products/add",
  upload.single("imagen"),
  authUser.isAdmOrOp,
  productsController.add
);

router.get(
  "/products/edit/:id/:categoria/",
  authUser.isAdmOrOp,
  productsController.edit
);
router.post(
  "/products/edit/:id",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  productsController.save
);

router.get(
  "/products/delete/:id/:categoria/",
  authUser.isAdmOrOp,
  productsController.delete
);

router.get(
  "/products/duplicate/:id/:categoria/",
  authUser.isAdmOrOp,
  productsController.duplicate
);
router.post(
  "/products/duplicate/",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  productsController.add
);
router.get(
  "/products/automobiles",
  authUser.isAdmOrOp,
  productsController.ShowAutomobiles
);
router.get(
  "/products/aerosol",
  authUser.isAdmOrOp,
  productsController.ShowAerosol
);
router.get(
  "/products/architectural",
  authUser.isAdmOrOp,
  productsController.ShowArchitectural
);
router.get(
  "/products/industrials",
  authUser.isAdmOrOp,
  productsController.ShowIndustrials
);
router.get(
  "/products/adhesives",
  authUser.isAdmOrOp,
  productsController.ShowAdhesives
);
router.get("/products/wood", authUser.isAdmOrOp, productsController.ShowWood);

module.exports = router;
