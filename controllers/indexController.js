const connection = require("../config/db");
const indexController = {};

indexController.getRandomProducts = (req, res) => {
  const query = `
        (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'arquitectonica' AS tabla_origen FROM pinturas_arquitectonicas ORDER BY RAND() LIMIT 3)
        UNION ALL
        (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'aerosol' AS tabla_origen FROM pinturas_en_aerosol ORDER BY RAND() LIMIT 3);
    `;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return;
    }
    // console.log(results);

    return res.render("index", {
      title: "Memo's Pinturas",
      products: results,
    });
  });
};

indexController.getAllRandomProducts = (req, res) => {
  const query = `(SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_arquitectonicas' AS tabla_origen FROM              pinturas_arquitectonicas ORDER BY RAND() LIMIT 3)
  UNION ALL
  (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_en_aerosol' AS tabla_origen FROM pinturas_en_aerosol ORDER BY RAND() LIMIT 3)
  UNION ALL
  (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'adhesivos_y_colorantes' AS tabla_origen FROM adhesivos_y_colorantes ORDER BY RAND() LIMIT 3)
  UNION ALL
  (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_industriales' AS tabla_origen FROM pinturas_industriales ORDER BY RAND() LIMIT 3)
  UNION ALL
  (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_automotrices' AS tabla_origen FROM pinturas_automotrices ORDER BY RAND() LIMIT 3)
  UNION ALL
  (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_para_madera' AS tabla_origen FROM pinturas_para_madera ORDER BY RAND() LIMIT 3);`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return;
    }
    // console.log(results);

    return res.render("products", {
      title: "Productos",
      products: results,
    });
  });
};

module.exports = indexController;
