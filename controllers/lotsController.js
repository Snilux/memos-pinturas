const connection = require("../config/db");
const lotsController = {};
const table = "lotes";
const queries = require("../controllers/queries/queriesLotsController");

const traceability = (id) => {
  return new Promise((resolve, reject) => {
    const ids = Array(8).fill(id);
    const query = queries.searchProductsTraceability;

    connection.query(query, ids, (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject(err);
      } else {
        resolve(results[0]); // Devolvemos el primer resultado
      }
    });
  });
};

const providerId = (name) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id_proveedor FROM proveedores WHERE nombre_empresa = ?;`;
    connection.query(query, name, (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject(err);
      } else {
        resolve(results[0]); // Devolvemos el primer resultado
      }
    });
  });
};

lotsController.AddLot = async (req, res) => {
  const { nombre_empresa, fecha_llegada, fecha_caducidad, descripcion } =
    req.body;

  let proveedor_id = await providerId(nombre_empresa);
  console.log(proveedor_id);

  // let traceabilityCode = await traceability(id_lote);
  // console.log(traceabilityCode);

  // traceabilityCode += id_lote;
};

lotsController.showLots = (req, res) => {
  const query = `SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    l.proveedor_id,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion
FROM
    ${table} l
LEFT JOIN
    proveedores p ON l.proveedor_id = p.id_proveedor;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }
    // console.log(results);
    return res.render("administration/lots/showAllLots", {
      title: "Lotes",
      lots: results,
    });
  });
};

lotsController.showProductsInLots = (req, res) => {
  const { id } = req.params;
  const query = queries.showProductsInLots;
  // console.log(id);
  const params = Array(7).fill(id);
  connection.query(query, params, (err, results) => {
    console.log(results);
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }

    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_origen
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_origen: formattedTabla,
      };
    });
    console.log(formattedResults);

    return res.render("administration/lots/showProducts", {
      title: "Productos en lote",
      lots: formattedResults,
    });
  });
};
module.exports = lotsController;
