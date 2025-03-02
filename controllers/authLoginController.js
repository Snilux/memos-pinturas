const connection = require("../config/db");
const userController = {};
userController.login = (req, res) => {
  const { user, password } = req.body;

  const query = `SELECT * FROM usuarios WHERE nombre = ? AND pass = ?`;
  connection.query(query, [user, password], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }
    if (results.length > 0) {
      if (results) {
      }
      return res.redirect("/");
    } else {
      //res.status(500).send("Credenciales incorrectas");
      return res.redirect("/login");
    }
  });
};

module.exports = userController;
