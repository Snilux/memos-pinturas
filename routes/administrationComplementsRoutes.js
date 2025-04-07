const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const upload = require("../middlewares/multerConfig");
const complementsController = require("../controllers/complementsController");

router.get("/", authUser.isAdmOrOp, complementsController.showAllComplements);

router.get("/add", authUser.isAdmOrOp, (req, res) => {
  res.render("administration/complements/addComplement", {
    title: "Añadir complemento",
  });
});
router.post(
  "/add",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  complementsController.addComplement
);

router.get(
  "/edit/:id",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  complementsController.editComplement
);

router.post(
  "/edit/:id",
  upload.single("imagen"),
  authUser.isAdmOrOp,
  complementsController.updateComplement
);

router.get(
  "/delete/:id",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  complementsController.deleteComplement
);

router.get(
  "/duplicate/:id",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  complementsController.duplicateComplement
);

router.post(
  "/duplicate/",
  authUser.isAdmOrOp,
  upload.single("imagen"),
  complementsController.addDuplicateComplement
);

router.get(
  "/verifyTag/:id",
  authUser.isAdmOrOp,
  complementsController.verifyTag
);

router.get(
  "/generateTag/:id",
  authUser.isAdmOrOp,
  complementsController.generateTag
);

router.get(
  "/search",
  authUser.isAdmOrOp,
  complementsController.searchComplements
);

module.exports = router;
