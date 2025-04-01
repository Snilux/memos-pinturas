module.exports = {
  getRandomProducts: `
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'arquitectonica' AS tabla_origen FROM pinturas_arquitectonicas ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'aerosol' AS tabla_origen FROM pinturas_en_aerosol ORDER BY RAND() LIMIT 3)
        `,
  getAllRandomProducts: `
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_arquitectonicas' AS tabla_origen FROM pinturas_arquitectonicas ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_en_aerosol' AS tabla_origen FROM pinturas_en_aerosol ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'adhesivos_y_colorantes' AS tabla_origen FROM adhesivos_y_colorantes ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_industriales' AS tabla_origen FROM pinturas_industriales ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_automotrices' AS tabla_origen FROM pinturas_automotrices ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros, 'pinturas_para_madera' AS tabla_origen FROM pinturas_para_madera ORDER BY RAND() LIMIT 3)
          UNION ALL
          (SELECT producto, precio_unitario_venta, imagen, caracteristicas,codigo_complemento, 'complementos' AS tabla_origen FROM complementos order by rand() LIMIT 3)
        `,

  searchProducts: `
        SELECT 'pinturas_arquitectonicas' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM pinturas_arquitectonicas
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        
        UNION ALL
        
        SELECT 'pinturas_en_aerosol' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM pinturas_en_aerosol
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        
        UNION ALL
        
        SELECT 'adhesivos_y_colorantes' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM adhesivos_y_colorantes
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        
        UNION ALL
        
        SELECT 'pinturas_industriales' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM pinturas_industriales
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        
        UNION ALL
        
        SELECT 'pinturas_automotrices' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM pinturas_automotrices
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        
        UNION ALL
        
        SELECT 'pinturas_para_madera' AS tabla, color_nombre, color_hex, precio_venta, imagen, cantidad_litros, subcategoria, nombre
        FROM pinturas_para_madera
        WHERE nombre LIKE ? OR color_nombre LIKE ? OR cantidad_litros LIKE ? OR precio_venta LIKE ? OR subcategoria LIKE ?
        UNION ALL
        SELECT 'complementos' AS tabla, producto, caracteristicas, precio_unitario_venta,imagen,codigo_complemento,cantidad,lote_id
        FROM complementos
        WHERE producto LIKE ? OR caracteristicas LIKE ? OR precio_unitario_venta LIKE ? OR codigo_complemento LIKE ?;
  `,
};
