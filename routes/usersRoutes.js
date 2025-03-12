const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const userController = require("../controllers/usersController");

router.get("/", authUser.isAdmin, userController.showUsers);

router.get("/add", authUser.isAdmin, (req, res) => {
  res.render("users/addUser", {
    title: "Agregar usuario",
    data: req.session.user,
  });
});
router.post("/add", authUser.isAdmin, userController.addUser);

//Update user
router.get("/edit/:id", authUser.isAdmin, userController.editUser);
router.post("/edit/:id", authUser.isAdmin, userController.updateUser);

router.get("/delete/:id", authUser.isAdmin, userController.deleteUser);

module.exports = router;
