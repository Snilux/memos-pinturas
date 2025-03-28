use memos_pinturas;

-- Inserción de datos de prueba
INSERT INTO usuarios (nombre, email, pass, rol) VALUES
('Ana', 'snilux.zero@gmail.com', '12345', 'Administrador'),
('Operador', 'luisgordillopor2@email.com', '12345', 'Operador');

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre_empresa, telefono, email) VALUES
('Ipesa', '2491110478', 'luisgordillopor2@gmail.com');

select * from proveedores;
-- Insertar lotes de ejemplo

INSERT INTO lotes (proveedor_id, fecha_llegada, fecha_caducidad, descripcion) VALUES
(1, '2023-01-15', '2025-01-15', 'Pinturas vinílicas');

describe proveedores;
describe lotes;



INSERT INTO pinturas_arquitectonicas (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Pintura Vinílica Blanca', 'Blanco', '#FFFFFF', 'PV001', 6, 19.00, 1, 250.00, 400.00, 50, 'TRZ001', 'Vinílicas'),
('Pintura Sellador Transparente', 'Transparente', '#F8F8F8', 'PS002', 4, 10.00, 1, 300.00, 500.00, 30, 'TRZ002', 'Selladores');

INSERT INTO pinturas_en_aerosol (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Aerosol Blanco Brillante', 'Blanco', '#FFFFFF', 'AE002', 11, 2, 10, 50.00, 80.00, 100, 'TRZ002', 'Aerosoles');

INSERT INTO adhesivos_y_colorantes (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Adhesivo para Cemento', 'Gris', '#808080', 'AC001', 8, 5.00, 1, 150.00, 250.00, 40, 'TRZ004', 'Adhesivos');

INSERT INTO pinturas_industriales (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Pintura Industrial Azul', 'Azul', '#0000FF', 'PI001', 6, 18.00, 1, 500.00, 750.00, 20, 'TRZ005', 'Línea Industrial');

INSERT INTO pinturas_automotrices (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Esmalte Automotriz Negro', 'Negro', '#000000', 'PA001', 4, 15.00, 1, 600.00, 900.00, 10, 'TRZ006', 'Línea Automotriz');

INSERT INTO pinturas_para_madera (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, codigo_trazabilidad, subcategoria) VALUES
('Tinta para Madera Nogal', 'Nogal', '#8B4513', 'PM001', 10, 3.00, 1, 200.00, 350.00, 25, 'TRZ007', 'Tintas');

INSERT INTO complementos (producto, codigo_complemento, caracteristicas, cantidad_caja, precio_caja, precio_unitario, precio_unitario_venta, cantidad, lote_id) VALUES
('La Guerrera', ' BRI-1/2', '1/2 ', 24, 600.00, 25.00, 35.00, 100, 1);

SELECT * FROM complementos;

DESCRIBE complementos;
DESCRIBE pinturas_arquitectonicas;
-- Crear una vista que combine todas las tablas de productos de pinturas
CREATE VIEW vista_todas_las_pinturas AS
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Arquitectónicas' AS categoria FROM pinturas_arquitectonicas
UNION ALL
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Aerosoles' AS categoria FROM pinturas_en_aerosol
UNION ALL
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Adhesivos y Colorantes' AS categoria FROM adhesivos_y_colorantes
UNION ALL
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Industriales' AS categoria FROM pinturas_industriales
UNION ALL
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Automotrices' AS categoria FROM pinturas_automotrices
UNION ALL
SELECT id_producto, nombre, color_nombre, color_hex, cantidad, precio_venta, 'Para Madera' AS categoria FROM pinturas_para_madera;

-- Consulta para buscar productos con coincidencias en el nombre o color
SELECT * FROM vista_todas_las_pinturas 
WHERE nombre LIKE '%blanco%' OR color_nombre LIKE '%blanco%';

SELECT * FROM vista_todas_las_pinturas;






SELECT 'pinturas_arquitectonicas' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_arquitectonicas
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' 

UNION ALL

SELECT 'pinturas_en_aerosol' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_en_aerosol
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' 

UNION ALL

SELECT 'adhesivos_y_colorantes' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM adhesivos_y_colorantes
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' 

UNION ALL

SELECT 'pinturas_industriales' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_industriales
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' 

UNION ALL

SELECT 'pinturas_automotrices' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_automotrices
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' 

UNION ALL

SELECT 'pinturas_para_madera' AS tabla, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_para_madera
WHERE nombre LIKE '%[tu_termino_de_busqueda]%' OR color_nombre LIKE '%[tu_termino_de_busqueda]%' OR cantidad_litros LIKE '%[tu_termino_de_busqueda]%' OR precio_venta LIKE '%[tu_termino_de_busqueda]%' OR subcategoria LIKE '%[tu_termino_de_busqueda]%' ;






-- Select all

SELECT 'Pinturas Arquitectónicas' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_arquitectonicas

UNION ALL

SELECT 'Pinturas en Aerosol' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_en_aerosol

UNION ALL

SELECT 'Adhesivos y Colorantes' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM adhesivos_y_colorantes

UNION ALL

SELECT 'Pinturas Industriales' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_industriales

UNION ALL

SELECT 'Pinturas Automotrices' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_automotrices

UNION ALL

SELECT 'Pinturas para Madera' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, subcategoria, nombre_proveedor, cantidad
FROM pinturas_para_madera;



(SELECT *, 'pinturas_arquitectonicas' AS tabla_origen FROM pinturas_arquitectonicas ORDER BY RAND() LIMIT 3)
UNION ALL
(SELECT *, 'pinturas_en_aerosol' AS tabla_origen FROM pinturas_en_aerosol ORDER BY RAND() LIMIT 3)
UNION ALL
(SELECT *, 'adhesivos_y_colorantes' AS tabla_origen FROM adhesivos_y_colorantes ORDER BY RAND() LIMIT 3)
UNION ALL
(SELECT *, 'pinturas_industriales' AS tabla_origen FROM pinturas_industriales ORDER BY RAND() LIMIT 3)
UNION ALL
(SELECT *, 'pinturas_automotrices' AS tabla_origen FROM pinturas_automotrices ORDER BY RAND() LIMIT 3)
UNION ALL
(SELECT *, 'pinturas_para_madera' AS tabla_origen FROM pinturas_para_madera ORDER BY RAND() LIMIT 3);


(SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros
FROM pinturas_arquitectonicas
ORDER BY RAND()
LIMIT 3)

UNION ALL

(SELECT color_nombre, color_hex, precio_venta, imagen, cantidad_litros
FROM pinturas_en_aerosol
ORDER BY RAND()
LIMIT 3);

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    l.proveedor_id,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion
FROM
    lotes l
LEFT JOIN
    proveedores p ON l.proveedor_id = p.id_proveedor;


SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'pinturas_arquitectonicas' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN pinturas_arquitectonicas pa ON l.id_lote = pa.lote_id

UNION ALL

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'pinturas_en_aerosol' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN pinturas_en_aerosol pa ON l.id_lote = pa.lote_id

UNION ALL

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'adhesivos_y_colorantes' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN adhesivos_y_colorantes pa ON l.id_lote = pa.lote_id

UNION ALL

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'pinturas_industriales' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN pinturas_industriales pa ON l.id_lote = pa.lote_id

UNION ALL

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'pinturas_automotrices' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN pinturas_automotrices pa ON l.id_lote = pa.lote_id

UNION ALL

SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion,
    pa.nombre AS nombre_producto,
    pa.color_nombre,
    pa.cantidad_litros,
    pa.precio_venta,
    pa.subcategoria,
    pa.cantidad,
    pa.imagen,
    'pinturas_para_madera' AS tabla_origen
FROM lotes l
INNER JOIN proveedores p ON l.proveedor_id = p.id_proveedor
INNER JOIN pinturas_para_madera pa ON l.id_lote = pa.lote_id;


SELECT 
    p.nombre_empresa AS Proveedor,
    GROUP_CONCAT(DISTINCT 
        CASE 
            WHEN pa.id_producto IS NOT NULL THEN 'ARQ'
            WHEN pea.id_producto IS NOT NULL THEN 'AER'
            WHEN ac.id_producto IS NOT NULL THEN 'ADH'
            WHEN pi.id_producto IS NOT NULL THEN 'IND'
            WHEN pau.id_producto IS NOT NULL THEN 'AUT'
            WHEN pm.id_producto IS NOT NULL THEN 'MAD'
            WHEN c.id_complemento IS NOT NULL THEN 'COM'
            ELSE NULL
        END 
        ORDER BY 
        CASE 
            WHEN pa.id_producto IS NOT NULL THEN 'ARQ'
            WHEN pea.id_producto IS NOT NULL THEN 'AER'
            WHEN ac.id_producto IS NOT NULL THEN 'ADH'
            WHEN pi.id_producto IS NOT NULL THEN 'IND'
            WHEN pau.id_producto IS NOT NULL THEN 'AUT'
            WHEN pm.id_producto IS NOT NULL THEN 'MAD'
            WHEN c.id_complemento IS NOT NULL THEN 'COM'
            ELSE NULL
        END SEPARATOR '-'
    ) AS Categorias,
    DATE_FORMAT(l.fecha_llegada, '%Y%m') AS AñoMes
FROM 
    lotes l
LEFT JOIN 
    pinturas_arquitectonicas pa ON l.id_lote = pa.lote_id
LEFT JOIN 
    pinturas_en_aerosol pea ON l.id_lote = pea.lote_id
LEFT JOIN 
    adhesivos_y_colorantes ac ON l.id_lote = ac.lote_id
LEFT JOIN 
    pinturas_industriales pi ON l.id_lote = pi.lote_id
LEFT JOIN 
    pinturas_automotrices pau ON l.id_lote = pau.lote_id
LEFT JOIN 
    pinturas_para_madera pm ON l.id_lote = pm.lote_id
LEFT JOIN
    complementos c ON l.id_lote = c.lote_id
LEFT JOIN
    proveedores p ON l.proveedor_id = p.id_proveedor
WHERE 
    l.id_lote = 19
GROUP BY 
    p.nombre_empresa, DATE_FORMAT(l.fecha_llegada, '%Y%m');
    
    
    
    
    
SELECT
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
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'AER' AS Categoria
    FROM pinturas_en_aerosol
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'ADH' AS Categoria
    FROM adhesivos_y_colorantes
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'IND' AS Categoria
    FROM pinturas_industriales
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'AUT' AS Categoria
    FROM pinturas_automotrices
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'MAD' AS Categoria
    FROM pinturas_para_madera
    WHERE lote_id = 19
    UNION
    SELECT
        lote_id,
        'COM' AS Categoria
    FROM complementos
    WHERE lote_id = 19
) AS Categorias ON l.id_lote = Categorias.lote_id
WHERE l.id_lote = 19
GROUP BY l.id_lote, p.nombre_empresa, l.fecha_llegada;


SELECT 'Complementos' AS tabla, 
id_complemento, 	
producto, 
caracteristicas, 
cantidad_caja, 
precio_caja, 
precio_unitario, 
precio_unitario_venta, 
lote_id , 
cantidad, 
imagen, 
codigo_complemento 
  FROM complementos
  WHERE producto LIKE ? OR codigo_complemento LIKE ? OR id_complemento LIKE ? OR cantidad LIKE ? OR lote_id LIKE ? OR caracteristicas LIKE ?;

SELECT * -- Selecciona todas las columnas del resultado combinado
FROM (
    SELECT 'Pinturas Arquitectónicas' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_arquitectonicas

    UNION ALL

    SELECT 'Pinturas en Aerosol' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_en_aerosol

    UNION ALL

    SELECT 'Adhesivos y Colorantes' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM adhesivos_y_colorantes

    UNION ALL

    SELECT 'Pinturas Industriales' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_industriales

    UNION ALL

    SELECT 'Pinturas Automotrices' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_automotrices

    UNION ALL

    SELECT 'Pinturas para Madera' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_para_madera
) AS TodosLosProductos -- Un alias para el resultado de la subconsulta UNION
ORDER BY
    id_producto DESC -- Ordena por la columna de fecha, los más recientes (DESCendente) primero
LIMIT 12; -- Limita el resultado final a 12 filas
