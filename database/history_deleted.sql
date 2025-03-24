USE memos_pinturas;


CREATE TABLE auditoria_eliminar_productos (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    tabla_modificada VARCHAR(50) NOT NULL, -- Para identificar la tabla original
    producto_id INT NOT NULL,
    codigo_pintura VARCHAR(50),       -- Datos del producto eliminado
    cantidad_litros DECIMAL(10,2),
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    cantidad INT,
    lote_id INT,
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    nombre varchar(255),
    subcategoria VARCHAR(255)
);



SELECT * FROM auditoria_editar_productos;
DROP TRIGGER IF EXISTS after_delete_pinturas_arquitectonicas;
DROP TRIGGER IF EXISTS after_delete_pinturas_en_aerosol;
DROP TRIGGER IF EXISTS after_delete_adhesivos_y_colorantes;
DROP TRIGGER IF EXISTS after_delete_pinturas_industriales;
DROP TRIGGER IF EXISTS after_delete_pinturas_automotrices;
DROP TRIGGER IF EXISTS after_delete_pinturas_para_madera;

DELIMITER //

-- Trigger para pinturas_arquitectonicas
CREATE TRIGGER after_delete_pinturas_arquitectonicas
AFTER DELETE ON pinturas_arquitectonicas
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'pinturas_arquitectonicas', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

-- Trigger para pinturas_en_aerosol
CREATE TRIGGER after_delete_pinturas_en_aerosol
AFTER DELETE ON pinturas_en_aerosol
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'pinturas_en_aerosol', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

-- Trigger para adhesivos_y_colorantes
CREATE TRIGGER after_delete_adhesivos_y_colorantes
AFTER DELETE ON adhesivos_y_colorantes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'adhesivos_y_colorantes', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

-- Trigger para pinturas_industriales
CREATE TRIGGER after_delete_pinturas_industriales
AFTER DELETE ON pinturas_industriales
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'pinturas_industriales', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

-- Trigger para pinturas_automotrices
CREATE TRIGGER after_delete_pinturas_automotrices
AFTER DELETE ON pinturas_automotrices
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'pinturas_automotrices', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

-- Trigger para pinturas_para_madera
CREATE TRIGGER after_delete_pinturas_para_madera
AFTER DELETE ON pinturas_para_madera
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminar_productos (
        tabla_modificada, producto_id, codigo_pintura, cantidad_litros, precio_compra,
        precio_venta, cantidad, lote_id, fecha_eliminacion, usuario_id,
        nombre, subcategoria
    ) VALUES (
        'pinturas_para_madera', OLD.id_producto, OLD.codigo_pintura, OLD.cantidad_litros,
        OLD.precio_compra, OLD.precio_venta, OLD.cantidad, OLD.lote_id, NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, OLD.subcategoria
    );
END //

DELIMITER ;
