const connection = require("../config/db");
const salesController = {};

salesController.findByCode = (req, res) => {
  try {
    const decodedCodeParam = decodeURIComponent(req.params.code);

    const codeObject = JSON.parse(decodedCodeParam);
    if (
      !codeObject ||
      typeof codeObject !== "object" ||
      !codeObject.productId ||
      !codeObject.category ||
      !codeObject.lotId ||
      !codeObject.code
    ) {
      console.error(
        "Objeto recibido en :code inválido o incompleto:",
        codeObject
      );
      return res.status(400).send("Datos de búsqueda inválidos o incompletos.");
    }
    // console.log(
    //   "Datos recibidos y parseados del objeto 'code':",
    //   codeObject.productId,
    //   codeObject.category,
    //   codeObject.lotId,
    //   codeObject.code
    // );
    if (codeObject.category === "complementos") {
      console.log("HOLA");
      
    }
    const query = `
            SELECT codigo_pintura, nombre, precio_venta FROM ?? WHERE id_producto = ? AND lote_id = ? AND codigo_pintura = ?
            LIMIT 1`;

    const params = [
      codeObject.category,
      codeObject.productId,
      codeObject.lotId,
      codeObject.code,
    ];

    connection.query(query, params, (err, rows) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res
          .status(500)
          .send("Error en el servidor al consultar producto.");
      }

      if (rows.length > 0) {
        const dbProduct = rows[0];
        const priceAsNumber = parseFloat(dbProduct.precio_venta);
        if (isNaN(priceAsNumber)) {
          console.error(
            `Precio inválido en BD para producto ${codeObject.code}: ${dbProduct.precio_venta}`
          );
          return res
            .status(500)
            .send("Error en formato de datos del producto (precio).");
        }

        const responseProduct = {
          idProduct: codeObject.productId,
          category: codeObject.category,
          code: dbProduct.codigo_pintura,
          name: dbProduct.nombre,
          price: priceAsNumber,
        };

        // console.log("Datos encontrados y formateados:", responseProduct);

        return res.status(200).json(responseProduct);
      } else {
        console.log(
          "No se encontraron datos para los criterios proporcionados."
        );
        return res
          .status(404)
          .send("Producto no encontrado con esos criterios.");
      }
    });
  } catch (error) {
    // Error al decodificar o parsear el req.params.code
    console.error("Error al procesar el parámetro :code:", error);
    // Es un error del cliente si envió un formato incorrecto
    res.status(400).send("Formato de parámetro de código inválido.");
  }
};

const UpdateQuantity = (productos) => {
  const queryUpdateQuantity = `SELECT cantidad FROM ??  WHERE id_producto = ?`;

  connection.query(
    queryUpdateQuantity,
    [productos.category, productos.productId],
    (err, rows) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res
          .status(500)
          .send("Error en el servidor al consultar producto.");
      }
      // console.log(rows);

      if (rows.length > 0) {
        const dbProduct = rows[0];
        const newQuantity = dbProduct.cantidad - productos.quantity;
        // console.log("Cantidad actualizada:", newQuantity);

        const updateQuery = `UPDATE ?? SET cantidad = ? WHERE id_producto = ? `;
        connection.query(
          updateQuery,
          [productos.category, newQuantity, productos.productId],
          (err) => {
            if (err) {
              console.error("Error al actualizar la cantidad:", err);
              return res
                .status(500)
                .send("Error al actualizar la cantidad del producto.");
            }

            console.log("Cantidad actualizada correctamente.");
            return
          }
        );
      } else {
        console.log(
          "No se encontraron datos para los criterios proporcionados."
        );
        return res
          .status(404)
          .send("Producto no encontrado con esos criterios.");
      }
    }
  );
};

salesController.finalizeSale = async (req, res) => {
  const { items, totalAmount } = req.body;

  // Guardar los productos en un array de objetos
  const productos = items.map((item) => ({
    productId: item.productId,
    category: item.category,
    code: item.code,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }));

  // console.log(productos[0]);
  // console.log(productos[0].category);

  const responseUpdateQuantity = await UpdateQuantity(productos[0]);

  const queryInsertSale = `INSERT INTO ventas (total_venta) VALUES (?)`;
};

module.exports = salesController;
