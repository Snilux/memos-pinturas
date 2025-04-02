const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const accountsController = require("../controllers/accountsController");

router.get("/", authUser.isAdmOrOp, accountsController.showAllAccounts);

module.exports = router;