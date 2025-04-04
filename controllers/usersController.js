const connection = require("../config/db");
const userController = {};
const { sendEmailPass } = require("./emailController");

userController.login = (req, res) => {
  const { user, password } = req.body;

  const query = `SELECT * FROM usuarios WHERE nombre = ? AND pass = ?`;
  connection.query(query, [user, password], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.redirect("/login");
    }

    if (results.length === 0) {
      return res.render("login", {
        title: "Iniciar sesión",
        errorMessage: "Usuario o contraseña incorrectos",
      });
    } else {
      const { rol, nombre, id_usuario, email, pass } = results[0];

      if (rol === "Administrador" && user == nombre && password == pass) {
        req.session.user = {
          idUser: id_usuario,
          user: nombre,
          email: email,
          pass: pass,
          rol: rol,
        };
        res.redirect("/admin");
      } else if (rol === "Operador" && user == nombre && password == pass) {
        req.session.user = {
          idUser: id_usuario,
          user: nombre,
          email: email,
          pass: pass,
          rol: rol,
        };
        res.redirect("/admin");
      }
    }
  });
};

userController.recoveryPass = (req, res) => {
  const { email } = req.body;

  const query = `SELECT * FROM usuarios WHERE email = ?`;

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }

    if (results.length === 0) {
      return res.render("recoveryPass", {
        title: "Recuperar contraseña",
        errorMessage: "El email no se encuentra registrado",
      });
    } else {
      const userEmail = results[0].email;
      const { pass, nombre } = results[0];

      if (userEmail === email) {
        sendEmailPass(userEmail, pass, nombre);

        return res.render("recoveryPass", {
          title: "Iniciar sesión",
          successMessage: "Se ha enviado un correo a tu dirección de email",
        });
      }
    }
  });
};

const verifyEmailExists = (email) => {
  const table = "usuarios";
  const query = `SELECT email FROM ?? WHERE email = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [table, email], (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject();
        return res.redirect("/admin");
      }
      if (results.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const verifyUserExists = (user) => {
  const table = "usuarios";
  const query = `SELECT nombre FROM ?? WHERE nombre = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [table, user], (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject();
        return res.redirect("/admin");
      }
      if (results.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

userController.addUser = async (req, res) => {
  const { user, email, password, rol } = req.body;

  const verifyEmailExistsPromise = await verifyEmailExists(email);
  const verifyUserExistsPromise = await verifyUserExists(user)

  console.log(verifyEmailExistsPromise);

  if (verifyEmailExistsPromise) {
    return res.render("users/addUser", {
      title: "Agregar usuario",
      errorMessage: "El email ya existe",
    });
  } else if (verifyUserExistsPromise) {
    return res.render("users/addUser", {
      title: "Agregar usuario",
      errorMessage: "El usuario ya se encuentra registrado",
    });
  }  else {
    const query = `INSERT INTO usuarios (nombre, email, pass, rol) VALUES (?, ?, ?, ?)`;
    connection.query(query, [user, email, password, rol], (err, results) => {
      if (err) {
        console.error(`Error en la consulta ${err}`);
        return res.status(500).send("Error del servidor");
      }

      return res.render("users/addUser", {
        title: "Agregar usuario",
        successMessage: "Usuario agregado correctamente",
      });
    });
  }
};

userController.showUsers = (req, res) => {
  const query = `SELECT * FROM usuarios`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }

    res.render("users/users", {
      users: results,
      title: "Usuarios",
      data: req.session.user,
    });
  });
};

userController.editUser = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM usuarios WHERE id_usuario = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }

    res.render("users/editUser", {
      users: results[0],
      title: "Editar usuario",
      data: req.session.user,
    });
  });
};

userController.updateUser = (req, res) => {
  const { id } = req.params;
  const { user, email, password, rol } = req.body;
  const query = `UPDATE usuarios SET nombre = ?, email = ?, pass = ?, rol = ? WHERE id_usuario = ?`;

  connection.query(query, [user, email, password, rol, id], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }
    res.redirect("/users");
  });
};

userController.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM usuarios WHERE id_usuario = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }
    res.redirect("/users");
  });
};
module.exports = userController;
