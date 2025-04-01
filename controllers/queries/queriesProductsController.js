module.exports = {
  showAllProductsQuery: `
  SELECT 'Pinturas Arquitectónicas' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_arquitectonicas

  UNION ALL

  SELECT 'Pinturas en Aerosol' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_en_aerosol

  UNION ALL

  SELECT 'Adhesivos y Colorantes' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM adhesivos_y_colorantes

  UNION ALL

  SELECT 'Pinturas Industriales' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_industriales

  UNION ALL

  SELECT 'Pinturas Automotrices' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_automotrices

  UNION ALL

  SELECT 'Pinturas para Madera' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_para_madera;
`,

  searchAllProducts: `SELECT 'pinturas_arquitectonicas' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_arquitectonicas
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?

  UNION ALL

  SELECT 'pinturas_en_aerosol' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_en_aerosol
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?

  UNION ALL

  SELECT 'adhesivos_y_colorantes' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM adhesivos_y_colorantes
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?

  UNION ALL

  SELECT 'pinturas_industriales' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_industriales
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?

  UNION ALL

  SELECT 'pinturas_automotrices' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_automotrices
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?

  UNION ALL

  SELECT 'pinturas_para_madera' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor
  FROM pinturas_para_madera
  WHERE id_producto LIKE ? OR nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ? OR codigo_pintura LIKE ?;`,
};
