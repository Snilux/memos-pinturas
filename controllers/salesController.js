// controllers/salesController.js
const connection = require("../config/db");
const salesController = {};

salesController.findByCode = (req, res) => {
  try {
    const decodedCodeParam = decodeURIComponent(req.params.code);
    const codeObject = JSON.parse(decodedCodeParam);

    let itemType = null;
    let isValid = false;
    let query = "";
    let params = [];
    let tableName = "";

    if (
      codeObject &&
      codeObject.tipe === "complementos" &&
      codeObject.complementId &&
      codeObject.code
    ) {
      itemType = "complemento";
      tableName = "complementos";
      isValid = codeObject.lotId !== undefined;

      if (isValid) {
        query = `
                    SELECT
                        id_complemento,
                        lote_id,
                        codigo_complemento,
                        producto,
                        precio_unitario_venta
                    FROM ${tableName}
                    WHERE id_complemento = ?
                    LIMIT 1`;
        params = [codeObject.complementId];
      }
    } else if (
      codeObject &&
      codeObject.category &&
      codeObject.productId &&
      codeObject.code
    ) {
      itemType = "pintura";
      tableName = codeObject.category;
      isValid = codeObject.lotId !== undefined; // Añade más validaciones

      if (isValid) {
        query = ` SELECT id_producto, codigo_pintura, nombre, precio_venta FROM ?? WHERE id_producto = ? AND lote_id = ? AND codigo_pintura = ? LIMIT 1`;
        params = [
          codeObject.category,
          codeObject.productId,
          codeObject.lotId,
          codeObject.code,
        ];
      }
    }

    // Si no es válido o no se reconoce el tipo
    if (!isValid || !itemType) {
      console.error("Objeto recibido inválido o incompleto:", codeObject);
      return res.status(400).send("Datos de búsqueda inválidos o incompletos.");
    }

    // console.log(
    //   `Buscando ${itemType} en tabla ${tableName} con params:`,
    //   params
    // );

    connection.query(query, params, (err, rows) => {
      if (err) {
        console.error(`Error al ejecutar la consulta para ${itemType}:`, err);
        return res
          .status(500)
          .send(`Error en el servidor al consultar ${itemType}.`);
      }

      if (rows.length > 0) {
        const dbItem = rows[0];
        const priceAsNumber = parseFloat(
          dbItem.precio_venta || dbItem.precio_unitario_venta
        );

        if (isNaN(priceAsNumber)) {
          console.error(
            `Precio inválido en BD para ${itemType} con código ${codeObject.code}: ${dbItem.precio_venta}`
          );
          return res
            .status(500)
            .send("Error en formato de datos del producto (precio).");
        }

        // console.log(dbItem);

        let responseProduct = {
          type: itemType,
          category: tableName || itemType,
          code: dbItem.codigo_pintura || dbItem.codigo_complemento,
          name: dbItem.nombre || dbItem.producto,
          price: priceAsNumber,
          lotId: dbItem.lote_id,
          productId: dbItem.id_producto || null,
          complementId: dbItem.id_complemento || null,
        };

        // console.log("Datos encontrados y formateados:", responseProduct);
        return res.status(200).json(responseProduct);
      } else {
        console.log(
          `No se encontró ${itemType} para los criterios proporcionados.`
        );
        return res
          .status(404)
          .send(
            `${
              itemType === "pintura" ? "Producto" : "Complemento"
            } no encontrado.`
          );
      }
    });
  } catch (error) {
    console.error("Error al procesar el parámetro :code:", error);
    res.status(400).send("Formato de parámetro de código inválido.");
  }
};

const UpdateQuantity = (productos) => {
  let queryUpdateQuantity = ``;
  let updateQuery = ``;

  if (productos.type === "complemento") {
    queryUpdateQuantity = `SELECT cantidad FROM ?? WHERE id_complemento = ?`;
    updateQuery = `UPDATE ?? SET cantidad = ? WHERE id_complemento = ?`;
    productos.category = "complementos";
  } else if (productos.type === "pintura") {
    queryUpdateQuantity = `SELECT cantidad FROM ?? WHERE id_producto = ?`;
    updateQuery = `UPDATE ?? SET cantidad = ? WHERE id_producto = ?`;
  } else {
    console.error("Tipo de producto no reconocido:", productos.type);
    return res.status(400).send("Tipo de producto no reconocido.");
  }

  // console.log(productos);

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
            return;
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
  // Renombrado para claridad
  // console.log(req.body);

  const { items, totalAmount } = req.body;
  const user = req.session.user.user;

  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    totalAmount == null
  ) {
    return res
      .status(400)
      .json({ message: "Datos de venta inválidos o incompletos." });
  }
  if (!user) {
    return res.status(401).json({ message: "Usuario no autenticado." });
  }

  // console.log("Iniciando finalización de venta para usuario:", user);
  console.log("Items recibidos:", items);

  // 2. Separar IDs y Cantidades por tipo
  const paintIds = [];
  const complementIds = [];
  let totalQuantity = 0; // Guardará las cantidades en el mismo orden que los items

  items.forEach((item) => {
    let isValidItem = false;

    const itemQuantity = parseInt(item.quantity, 10);
    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      console.warn("Cantidad inválida o cero encontrada para el item:", item);
      return; 
    }

    if (item.type === "pintura" && item.productId != null) {
      paintIds.push(item.productId);
      isValidItem = true;
    } else if (item.type === "complemento" && item.complementId != null) {
      complementIds.push(item.complementId);
      isValidItem = true;
    } else {
      console.warn("Item inválido o tipo desconocido encontrado:", item);
    }

    // Sumar la cantidad SI el item era válido
    if (isValidItem) {
      totalQuantity += itemQuantity; // <--- SUMAR la cantidad al total
    }
  });

  const paintIdsString = paintIds.filter((id) => id !== null).join(",");
  const complementIdsString = complementIds
    .filter((id) => id !== null)
    .join(",");

  if (
    paintIds.filter((id) => id !== null).length === 0 &&
    complementIds.filter((id) => id !== null).length === 0
  ) {
    return res.status(400).json({
      message: "No hay productos o complementos válidos en la venta.",
    });
  }

  console.log("IDs Pinturas:", paintIdsString);
  console.log("IDs Complementos:", complementIdsString);
  console.log("Cantidades:", totalQuantity);
  console.log("Total Venta:", totalAmount);

  try {
    const saleTable = `ventas`;
    const queryInsertSale = `
            INSERT INTO ?? (
                nombre_usuario,
                producto_id,      -- Columna para IDs de pinturas
                complemento_id,   -- Columna para IDs de complementos
                cantidad_vendida,         -- Columna para cantidades (en orden)
                precio_total_venta, -- Columna para el total
                fecha         -- Opcional: Columna para la fecha
            ) VALUES (?, ?, ?, ?, ?, NOW())`;

    const insertParams = [
      saleTable,
      user,
      paintIdsString, // String de IDs de pinturas
      complementIdsString, // String de IDs de complementos
      totalQuantity, // String de cantidades
      totalAmount, // El total ya calculado
    ];

    connection.query(queryInsertSale, insertParams, (err, result) => {
      if (err) {
        console.error("Error al insertar la venta:", err);
        return res
          .status(500)
          .json({ message: "Error al registrar la venta." });
      }

      console.log("Venta registrada con éxito:", result.insertId);

      res.status(201).json({
        success: true,
        message: "Venta registrada con éxito.",
        saleId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Error al procesar la venta en el backend:", error);
    res.status(500).json({ message: "Error interno al registrar la venta." });
  }
};

module.exports = salesController;
