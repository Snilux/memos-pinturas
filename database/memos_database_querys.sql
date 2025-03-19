use memos_pinturas;

-- Inserción de datos de prueba
INSERT INTO usuarios (nombre, email, pass, rol) VALUES
('Ana', 'snilux.zero@gmail.com', '12345', 'Administrador'),
('Operador', 'luisgordillopor2@email.com', '12345', 'Operador');

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre_empresa, telefono, email) VALUES
('Pinturas Colorín', '555-1234', 'info@colorin.com'),
('Aerosoles Express', '555-5678', 'ventas@aerosolesexpress.com'),
('Adhesivos Unidos', '555-9012', 'contacto@adhesivosunidos.com'),
('Industrias Pintor', '555-3456', 'info@industriaspintor.com'),
('Automotriz Brillante', '555-7890', 'ventas@automotrizbrillante.com'),
('Madera Bella', '555-2345', 'contacto@maderabella.com');

select * from proveedores;
-- Insertar lotes de ejemplo

INSERT INTO lotes (codigo_trazabilidad, proveedor_id, fecha_llegada, fecha_caducidad, descripcion) VALUES
('LOTE001', 1, '2023-01-15', '2025-01-15', 'Pinturas vinílicas'),
('LOTE002', 7, '2023-02-20', '2024-02-20', 'Aerosoles mate'),
('LOTE003', 8, '2023-03-25', '2026-03-25', 'Adhesivos de contacto'),
('LOTE004', 9, '2023-04-30', '2027-04-30', 'Pinturas industriales'),
('LOTE005', 10, '2023-05-15', '2025-05-15', 'Pinturas automotrices'),
('LOTE006', 11, '2023-06-20', '2024-06-20', 'Tintas para madera');

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

INSERT INTO complementos (producto, codigo_trazabilidad, caracteristicas, cantidad_caja, precio_caja, precio_unitario, precio_caja_venta, precio_unitario_venta, cantidad) VALUES
('Brocha de 2 pulgadas', 'CMP001', 'Brocha de cerdas sintéticas, mango de madera', 24, 600.00, 25.00, 800.00, 35.00, 100),
('Rodillo para Pintura de 9"', 'CMP002', 'Rodillo de esponja con mango ergonómico', 12, 480.00, 40.00, 600.00, 50.00, 60),
('Bandeja para Rodillo', 'CMP003', 'Bandeja plástica de 12 pulgadas', 10, 300.00, 30.00, 450.00, 45.00, 40),
('Lija para Madera Grano 220', 'CMP004', 'Lija fina para acabados en madera', 50, 250.00, 5.00, 350.00, 7.00, 200),
('Cinta de enmascarar 1"', 'CMP005', 'Cinta adhesiva para protección en pintura', 48, 960.00, 20.00, 1200.00, 25.00, 150);

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



