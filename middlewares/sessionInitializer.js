const sessionInitializer = (req, res, next) => {
  if (!req.session.user) {
    req.session.user = { user: "invitado", rol: "Invitado" }; 
  }
  next();
};

module.exports = sessionInitializer;
