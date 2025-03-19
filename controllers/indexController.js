const connection = require("../config/db");
const indexController = {};
const queries = require("./queries/queriesIndexController");

const categoriaMap = {
  "Pinturas Automotrices": "pinturas_automotrices",
  "Pinturas Arquitectónicas": "pinturas_arquitectonicas",
  "Pinturas en Aerosol": "pinturas_en_aerosol",
  "Pinturas Industriales": "pinturas_industriales",
  "Adhesivos y Colorantes": "adhesivos_y_colorantes",
  "Pinturas para Madera": "pinturas_para_madera",
  Complementos: "complementos",
};

indexController.getRandomProducts = (req, res) => {
  const query = queries.getRandomProducts;

  connection.query(query, (err, results) => {
    if (err) {
      return;
    }
    return res.render("index", {
      title: "Memo's Pinturas",
      products: results,
    });
  });
};

indexController.getAllRandomProducts = (req, res) => {
  const query = queries.getAllRandomProducts;

  connection.query(query, (err, results) => {
    if (err) {
      return;
    }

    return res.render("products", {
      title: "Productos",
      products: results,
    });
  });
};

indexController.searchAllProducts = (req, res) => {
  const { selectBusqueda } = req.query;
  const table = categoriaMap[selectBusqueda];

  if (!table) {
    return res.redirect("/products");
  }

  const query = `SELECT imagen, precio_venta, color_nombre, color_hex, cantidad_litros FROM ${table}`; // Insertar el nombre de la tabla directamente

  connection.query(query, (err, results) => {
    if (err) {
      return res.redirect("/products");
    }
    res.render("searchProducts", {
      title: `Productos ${selectBusqueda} `,
      category: selectBusqueda,
      products: results,
    });
  });
};

indexController.searchProducts = (req, res) => {
  const { value } = req.query;
  const query = queries.searchProducts;

  if (!value) {
    res.redirect("/products");
  }
  const searchTermWildcard = `%${value}%`;
  const queryParams = Array(30).fill(searchTermWildcard);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/products");
    }

    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla: formattedTabla,
      };
    });

    res.render("searchProducts", {
      title: `Productos ${value}`,
      products: formattedResults,
      category: `Resultados para ${value}`,
    });
  });
};
module.exports = indexController;
