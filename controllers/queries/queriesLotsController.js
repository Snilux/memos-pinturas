module.exports.showProductsInLots = `SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'pinturas_arquitectonicas' AS tabla_origen
FROM pinturas_arquitectonicas pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'pinturas_en_aerosol' AS tabla_origen
FROM pinturas_en_aerosol pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'adhesivos_y_colorantes' AS tabla_origen
FROM adhesivos_y_colorantes pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'pinturas_industriales' AS tabla_origen
FROM pinturas_industriales pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'pinturas_automotrices' AS tabla_origen
FROM pinturas_automotrices pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    pa.id_producto,
    pa.nombre,
    pa.color_nombre,
    pa.color_hex,
    pa.codigo_pintura,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    pa.nombre_proveedor,
    'pinturas_para_madera' AS tabla_origen
FROM pinturas_para_madera pa
INNER JOIN lotes l ON pa.lote_id = l.id_lote
WHERE pa.lote_id = ?

UNION ALL

SELECT
    l.codigo_trazabilidad AS codigo_lote,
    c.id_complemento AS id_producto,
    c.producto AS nombre,
    'Complemento' AS color_nombre, -- Puedes ajustar esto según tus necesidades
    NULL AS color_hex,
    NULL AS codigo_pintura,
    NULL AS cantidad_litros,
    c.precio_unitario_venta AS precio_venta,
    NULL AS subcategoria,
    c.cantidad,
    c.imgen AS imagen,
    '' AS nombre_proveedor, -- Los complementos no tienen nombre_proveedor, pon algo coherente
    'complementos' AS tabla_origen
FROM complementos c
INNER JOIN lotes l ON c.lote_id = l.id_lote
WHERE c.lote_id = ?;`;

module.exports.searchProductsTraceability = `SELECT
    p.nombre_empresa AS Proveedor,
    GROUP_CONCAT(DISTINCT Categorias.Categoria ORDER BY Categorias.Categoria SEPARATOR '-') AS Categorias,
    DATE_FORMAT(l.fecha_llegada, '%Y%m') AS AñoMes
FROM
    lotes l
LEFT JOIN
    proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN (
    SELECT
        lote_id,
        'ARQ' AS Categoria
    FROM pinturas_arquitectonicas
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'AER' AS Categoria
    FROM pinturas_en_aerosol
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'ADH' AS Categoria
    FROM adhesivos_y_colorantes
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'IND' AS Categoria
    FROM pinturas_industriales
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'AUT' AS Categoria
    FROM pinturas_automotrices
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'MAD' AS Categoria
    FROM pinturas_para_madera
    WHERE lote_id = ?
    UNION
    SELECT
        lote_id,
        'COM' AS Categoria
    FROM complementos
    WHERE lote_id = ?
) AS Categorias ON l.id_lote = Categorias.lote_id
WHERE l.id_lote = ?
GROUP BY l.id_lote, p.nombre_empresa, l.fecha_llegada;`;
