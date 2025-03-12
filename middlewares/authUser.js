const verifyUser = {};

verifyUser.isAdmin = (req, res, next) => {
  if (req.session.user.rol === "Administrador") {
    next();
  } else {
    return res.render("administration/panelAdministration", {
      title: "Panel de administracion",
      errorMessage: "No tienes permiso para acceder a esta sección",
    });
  }
};
verifyUser.isOperator = (req, res, next) => {
  if (req.session.user.rol === "Operador") {
    next();
  } else {
    return res.render("administration/panelAdministration", {
      title: "Panel de administracion",
      errorMessage: "No tienes permiso para acceder a esta sección",
    });
  }
};

verifyUser.isAdmOrOp = (req, res, next) => {
  if (
    req.session.user.rol === "Administrador" ||
    req.session.user.rol === "Operador"
  ) {
    next();
  } else {
    return res.render("login", {
      title: "Panel de administracion",
      errorMessage: "No tienes permiso para acceder a esta sección",
    });
  }
};

module.exports = verifyUser;
