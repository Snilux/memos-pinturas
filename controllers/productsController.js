const express = require("express");
const fs = require("fs");
const path = require("path");
const connection = require("../config/db");
const queries = require("./queries/queriesProductsController");
const productsController = {};

const categoriaMap = {
  "Pinturas Automotrices": "pinturas_automotrices",
  "Pinturas Arquitectónicas": "pinturas_arquitectonicas",
  "Pinturas en Aerosol": "pinturas_en_aerosol",
  "Pinturas Industriales": "pinturas_industriales",
  "Adhesivos y Colorantes": "adhesivos_y_colorantes",
  "Pinturas para Madera": "pinturas_para_madera",
};

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

productsController.ShowAllProducts = (req, res) => {
  const showAllProductsQuery = queries.showAllProductsQuery;
  connection.query(showAllProductsQuery, (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    } else {
      res.render("administration/products/showProducts", {
        title: `Productos`,
        data: req.session.user,
        products: results,
        type: "",
      });
    }
  });
};

productsController.add = (req, res) => {
  let imagePath = null;
  if (req.file) {
    imagePath = req.file.filename;
    console.log("Ruta de la imagen:", imagePath);
  } else {
    console.log("No se subió la imagen");
  }
  const {
    tabla_categoria,
    nombre,
    color_nombre,
    color_hex,
    codigo_pintura,
    cantidad_caja,
    litros,
    lote_id,
    precio_compra,
    precio_venta,
    cantidad,
    subcategoria,
    nombre_proveedor,
  } = req.body;

  const tabla = categoriaMap[tabla_categoria];

  if (tabla) {
    const query = `INSERT INTO ${tabla} (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, subcategoria, nombre_proveedor, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        nombre,
        color_nombre,
        color_hex,
        codigo_pintura,
        cantidad_caja,
        litros,
        lote_id,
        precio_compra,
        precio_venta,
        cantidad,
        subcategoria,
        nombre_proveedor,
        imagePath,
      ],
      (err, results) => {
        if (err) {
          console.error(`Error en la consulta ${err}`);
          return res.status(500).send("Error del servidor");
        } else {
          return res.render("administration/products/addProduct", {
            title: "Añadir productos",
            data: req.session.user,
            successMessage: "El producto se agrego correctamente",
          });
        }
      }
    );
  } else {
    return res.render("administration/products/addProduct", {
      title: "Añadir productos",
      data: req.session.user,
      errorMessage: "Categoria invalida",
    });
  }
};

productsController.edit = (req, res) => {
  console.log(req.params);
  const { id, categoria } = req.params;

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(categoria)
      )
    ];
  const query = `SELECT * FROM ${tabla} WHERE id_producto = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      if (err) {
        console.error(`Error en la consulta ${err}`);
        return res.status(500).send("Error del servidor");
      }
    }
    res.render("administration/products/editProduct", {
      product: results[0],
      category: categoria,
      title: "Editar producto",
      data: req.session.user,
    });
  });
};

productsController.save = async (req, res) => {
  const id_producto = req.params.id;

  console.log(req.params);
  console.log(req.body);

  const {
    codigo_pintura,
    precio_compra,
    precio_venta,
    cantidad,
    currentImagePath,
    lote_id,
    tabla_categoria,
    subcategoria,
    nombre,
    color_nombre,
    color_hex,
    cantidad_caja,
    nombre_proveedor,
  } = req.body;

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(tabla_categoria)
      )
    ];
  let imagePath = currentImagePath;

  try {
    if (req.file) {
      imagePath = req.file.filename;

      if (currentImagePath && currentImagePath !== imagePath) {
        const absoluteOldImagePath = path.join(
          __dirname,
          "..",
          "public/uploads/images/",
          currentImagePath
        );
        fs.unlink(absoluteOldImagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen anterior:", err);
          }
        });
      }
    }

    const query = `
      UPDATE ${tabla} 
      SET 
        nombre = ?,
        color_nombre = ?,
        color_hex = ?,
        codigo_pintura = ?,
        cantidad_caja = ?,
        lote_id = ?,
        precio_compra = ?,
        precio_venta = ?,
        cantidad = ?,
        imagen = ?,
        subcategoria = ?,
        nombre_proveedor = ?
      WHERE id_producto = ?
    `;

    // Envolver la consulta en una promesa
    await new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          nombre,
          color_nombre,
          color_hex,
          codigo_pintura,
          cantidad_caja,
          lote_id,
          precio_compra,
          precio_venta,
          cantidad,
          imagePath,
          subcategoria,
          nombre_proveedor,
          id_producto,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .send("Error interno del servidor al actualizar el producto.");
  }
};

productsController.delete = async (req, res) => {
  const id_producto = req.params.id;
  const categoria = req.params.categoria;

  // const tabla = categoriaMap[categoria];

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(categoria)
      )
    ];

  // console.log(tabla, id_producto);

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT imagen FROM  ${tabla} WHERE id_producto = ?`, [
        id_producto,
      ]);

    if (rows.length > 0) {
      const { imagen } = rows[0];

      await connection
        .promise()
        .query(`DELETE FROM ${tabla} WHERE id_producto = ?`, [id_producto]);

      if (imagen) {
        const absoluteImagePath = path.join(
          __dirname,
          "..",
          "public/uploads/images/",
          imagen
        );
        fs.unlink(absoluteImagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          }
        });
      }

      res.redirect("/admin/products");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error interno del servidor al eliminar el producto.");
  }
};

productsController.duplicate = (req, res) => {
  console.log(req.params);
  const { id, categoria } = req.params;

  const tabla = categoriaMap[categoria];
  const query = `SELECT * FROM ${tabla} WHERE id_producto = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      if (err) {
        console.error(`Error en la consulta ${err}`);
        return res.status(500).send("Error del servidor");
      }
    }
    res.render("administration/products/duplicateProduct", {
      product: results[0],
      category: categoria,
      title: "Duplicar producto",
      data: req.session.user,
    });
  });
};

productsController.ShowAutomobiles = (req, res) => {
  const query = `SELECT * FROM pinturas_automotrices`;
  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas automotrices",
      data: req.session.user,
      type: "Pinturas Automotrices",
    });
  });
};

productsController.ShowAerosol = (req, res) => {
  const query = `SELECT * FROM pinturas_en_aerosol`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas arosoles",
      data: req.session.user,
      type: "Pinturas Arosoles",
    });
  });
};

productsController.ShowArchitectural = (req, res) => {
  const query = `SELECT * FROM pinturas_arquitectonicas`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas arquitectónicas",
      data: req.session.user,
      type: "Pinturas Arquitectónicas",
    });
  });
};

productsController.ShowIndustrials = (req, res) => {
  const query = `SELECT * FROM pinturas_industriales`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas industriales",
      data: req.session.user,
      type: "Pinturas Industriales",
    });
  });
};

productsController.ShowAdhesives = (req, res) => {
  const query = `SELECT * FROM adhesivos_y_colorantes`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Adhesivos y colorantes",
      data: req.session.user,
      type: "Adhesivos y colorantes",
    });
  });
};

productsController.ShowAdhesives = (req, res) => {
  const query = `SELECT * FROM adhesivos_y_colorantes`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Adhesivos y colorantes",
      data: req.session.user,
      type: "Adhesivos y colorantes",
    });
  });
};

productsController.ShowWood = (req, res) => {
  const query = `SELECT * FROM pinturas_para_madera`;
  connection.query(query, (err, results) => {
    console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas para madera",
      data: req.session.user,
      type: "Pinturas para madera",
    });
  });
};

productsController.searchProducts = (req, res) => {
  const { value } = req.query;
  const query = queries.searchAllProducts;
  // console.log(value);

  if (!value) {
    res.redirect("/products");
  }
  const searchTermWildcard = `%${value}%`;
  const queryParams = Array(30).fill(searchTermWildcard);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/products");
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
    // console.log(formattedResults);

    res.render("administration/products/showProducts", {
      title: `Productos`,
      data: req.session.user,
      products: formattedResults,
      type: "",
    });
  });
};

module.exports = productsController;
