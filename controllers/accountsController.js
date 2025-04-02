const connection = require("../config/db");
const accountsController = {};

accountsController.showAllAccounts = (req, res) => {
  const userData = req.session.user;

  res.render("administration/account/showAccount", {
    title: "Cuentas",
    data: req.session.user,
    userData: userData,
  });
};

module.exports = accountsController;
