const verifyUser = {};

const preventCache = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
};

verifyUser.isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  preventCache(req, res, () => {
    if (req.session.user.rol === "Administrador") {
      next();
    } else {
      return res.render("administration/panelAdministration", {
        title: "Panel de administración",
        errorMessage: "No tienes permiso para acceder a esta sección",
      });
    }
  });
};

verifyUser.isOperator = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  preventCache(req, res, () => {
    if (req.session.user.rol === "Operador") {
      next();
    } else {
      return res.render("administration/panelAdministration", {
        title: "Panel de administración",
        errorMessage: "No tienes permiso para acceder a esta sección",
      });
    }
  });
};

verifyUser.isAdmOrOp = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  preventCache(req, res, () => {
    if (
      req.session.user.rol === "Administrador" ||
      req.session.user.rol === "Operador"
    ) {
      next();
    } else {
      return res.render("login", {
        title: "Inicio de sesión",
        errorMessage: "No tienes permiso para acceder a esta sección",
      });
    }
  });
};

module.exports = verifyUser;
