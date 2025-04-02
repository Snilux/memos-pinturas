const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const authUser = require("../middlewares/authUser");
const upload = require("../middlewares/multerConfig");
const providerRoutes = require("./administrationProvidersRoutes");
const lotsRoutes = require("./administrationLotsRoutes");
const historyRoutes = require("./administrationHistoryRoutes");
const salesRoutes = require("./administrationSalesRoutes");
const complementsRoutes = require("./administrationComplementsRoutes");
const accountsRoutes = require("./administrationAccountRoutes");


router.get("/", authUser.isAdmOrOp, (req, res, next) => {
  res.render("administration/panelAdministration", {
    title: `Panel de administracion`,
    data: req.session.user,
  });
});
// Uso de las rutas de proveedores
router.use("/providers", providerRoutes);

router.use("/lots", lotsRoutes);

router.use("/history", historyRoutes);

router.use("/sales", salesRoutes);

router.use("/complements", complementsRoutes);

router.use("/account", accountsRoutes);

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
  "/products/verifyTag/:id/:category/",
  authUser.isAdmOrOp,
  productsController.verifyTag
);
router.get(
  "/products/generateTag/:id/:category/",
  authUser.isAdmOrOp,
  productsController.generateTag
);

router.get(
  "/products/edit/:id/:categoria/:path",
  authUser.isAdmOrOp,
  productsController.edit
);
router.post(
  "/products/edit/:id/:path",
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

router.get(
  "/products/search",
  authUser.isAdmOrOp,
  productsController.searchProducts
);
module.exports = router;
