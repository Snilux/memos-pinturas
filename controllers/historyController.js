const connection = require("../config/db");
const historyController = {};
const table = "auditoria_editar_productos";
const table1 = "auditoria_eliminar_productos";

historyController.showAllEdited = (req, res) => {
  const query = `SELECT * FROM ${table}`;
  connection.query(query, async (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    // console.log(results);

    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_modificada
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_modificada: formattedTabla,
      };
    });


    res.render("administration/history/historyEdited", {
      title: "Productos editados",
      editedProducts: formattedResults,
    });
  });
};

historyController.showAllDeleted = (req, res) => {
  const query = `SELECT * FROM ${table1}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_modificada
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_modificada: formattedTabla,
      };
    });

    // console.log(formattedResults);

    res.render("administration/history/historyRemoved", {
      title: "Productos editados",
      editedProducts: formattedResults,
    });
  });
};

historyController.deleteEdited = (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM ${table} WHERE id_auditoria = ?`;


  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }

    res.redirect("/admin/history/edited");
  });
};
historyController.deleteRemoved = (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM ${table1} WHERE id_auditoria = ?`;

  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    res.redirect("/admin/history/removed");
  });
};
module.exports = historyController;
