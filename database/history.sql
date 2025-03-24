USE memos_pinturas;
DROP TABLE auditoria_editar_productos;
CREATE TABLE auditoria_editar_productos (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    tabla_modificada VARCHAR(50) NOT NULL, -- Nuevo campo para identificar la tabla original
    producto_id INT NOT NULL,
    codigo_pintura_anterior VARCHAR(50),
    codigo_pintura_nuevo VARCHAR(50),
    cantidad_litros_anterior DECIMAL(10,2),
    cantidad_litros_nuevo DECIMAL(10,2),
    precio_compra_anterior DECIMAL(10,2),
    precio_compra_nuevo DECIMAL(10,2),
    precio_venta_anterior DECIMAL(10,2),
    precio_venta_nuevo DECIMAL(10,2),
    cantidad_anterior INT,
    cantidad_nueva INT,
    lote_id_anterior INT,
    lote_id_nuevo INT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    nombre_anterior VARCHAR(255),  
    nombre_nuevo VARCHAR(255),
    subcategoria_anterior VARCHAR(255),
    subcategoria_nuevo VARCHAR(255)
);

SELECT * FROM auditoria_editar_productos;
DROP TRIGGER IF EXISTS after_update_pinturas_arquitectonicas;
DROP TRIGGER IF EXISTS after_update_pinturas_aerosoles;
DROP TRIGGER IF EXISTS after_update_pinturas_adhesivos;
DROP TRIGGER IF EXISTS after_update_pinturas_industriales;
DROP TRIGGER IF EXISTS after_update_pinturas_automotrices;
DROP TRIGGER IF EXISTS after_update_pinturas_madera;


Aquí están los triggers modificados para cumplir con este requisito:DELIMITER //

-- Trigger para pinturas_arquitectonicas
CREATE TRIGGER after_update_pinturas_arquitectonicas
AFTER UPDATE ON pinturas_arquitectonicas
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,  -- Agregados para incluir nombre
        subcategoria_anterior, subcategoria_nuevo -- Agregados para incluir subcategoria
    ) VALUES (
        'pinturas_arquitectonicas', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

-- Trigger para pinturas_en_aerosol
CREATE TRIGGER after_update_pinturas_aerosoles
AFTER UPDATE ON pinturas_en_aerosol
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,
        subcategoria_anterior, subcategoria_nuevo
    ) VALUES (
        'pinturas_en_aerosol', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

-- Trigger para adhesivos_y_colorantes
CREATE TRIGGER after_update_pinturas_adhesivos
AFTER UPDATE ON adhesivos_y_colorantes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,
        subcategoria_anterior, subcategoria_nuevo
    ) VALUES (
        'adhesivos_y_colorantes', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

-- Trigger para pinturas_industriales
CREATE TRIGGER after_update_pinturas_industriales
AFTER UPDATE ON pinturas_industriales
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,
        subcategoria_anterior, subcategoria_nuevo
    ) VALUES (
        'pinturas_industriales', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

-- Trigger para pinturas_automotrices
CREATE TRIGGER after_update_pinturas_automotrices
AFTER UPDATE ON pinturas_automotrices
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,
        subcategoria_anterior, subcategoria_nuevo
    ) VALUES (
        'pinturas_automotrices', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

-- Trigger para pinturas_para_madera
CREATE TRIGGER after_update_pinturas_madera
AFTER UPDATE ON pinturas_para_madera
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_editar_productos (
        tabla_modificada, producto_id,
        codigo_pintura_anterior, codigo_pintura_nuevo,
        cantidad_litros_anterior, cantidad_litros_nuevo,
        precio_compra_anterior, precio_compra_nuevo,
        precio_venta_anterior, precio_venta_nuevo,
        cantidad_anterior, cantidad_nueva,
        lote_id_anterior, lote_id_nuevo,
        fecha_cambio, usuario_id,
        nombre_anterior, nombre_nuevo,
        subcategoria_anterior, subcategoria_nuevo
    ) VALUES (
        'pinturas_para_madera', OLD.id_producto,
        OLD.codigo_pintura, NEW.codigo_pintura,
        IF(OLD.cantidad_litros != NEW.cantidad_litros, OLD.cantidad_litros, NULL),
        IF(OLD.cantidad_litros != NEW.cantidad_litros, NEW.cantidad_litros, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, OLD.precio_compra, NULL),
        IF(OLD.precio_compra != NEW.precio_compra, NEW.precio_compra, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, OLD.precio_venta, NULL),
        IF(OLD.precio_venta != NEW.precio_venta, NEW.precio_venta, NULL),
        IF(OLD.cantidad != NEW.cantidad, OLD.cantidad, NULL),
        IF(OLD.cantidad != NEW.cantidad, NEW.cantidad, NULL),
        OLD.lote_id, NEW.lote_id,
        NOW(),
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1),
        OLD.nombre, NEW.nombre,
        OLD.subcategoria, NEW.subcategoria
    );
END //

DELIMITER ;

