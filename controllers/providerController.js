const connection = require("../config/db");
const providersController = {};
const table = "proveedores";

providersController.showProviders = (req, res) => {
  const query = `SELECT * FROM ${table}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.render("/admin");
    }

    // console.log(results);

    res.render("administration/providers/showProviders", {
      title: "Proveedores",
      providers: results,
    });
  });
};

providersController.addProviders = (req, res) => {
  const { nombre_empresa, telefono, email } = req.body;
  const query = `INSERT INTO ${table} (nombre_empresa, telefono, email) VALUES (?, ?, ?)`;
  connection.query(
    query,
    [table, nombre_empresa, telefono, email],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        return res.redirect("/admin/providers");
      }
      return res.render("administration/providers/addProvider", {
        title: "Añadir proveedor",
        data: req.session.user,
        successMessage: "El proveedor se agrego correctamente",
      });
    }
  );
};

providersController.editProvider = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM ${table} WHERE id_proveedor = ?`;

  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("admin/providers");
    }
    // console.log(results);
    res.render("administration/providers/editProvider", {
      title: "Editar proveedor",
      provider: results[0],
    });
  });
};

providersController.saveProvider = (req, res) => {
  const { id } = req.params;
  const { nombre_empresa, telefono, email } = req.body;
  const query = `UPDATE ${table} SET nombre_empresa = ?, telefono = ?, email = ? WHERE id_proveedor = ?`;

  connection.query(
    query,
    [nombre_empresa, telefono, email, id],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err} `);
        return res.redirect("/admin/providers");
      }

      return res.render("administration/providers/editProvider", {
        title: "Editar proveedor",
        provider: results,
        successMessage: "El proveedor se actualizo correctamente",
      });
    }
  );
};
providersController.deleteProvider = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM ${table} WHERE id_proveedor = ?`;

  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/providers");
    }
    return res.redirect("/admin/providers");
  });
};

module.exports = providersController;
