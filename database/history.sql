use memos_pinturas;

CREATE TABLE auditoria_productos (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre_anterior VARCHAR(100),
    nombre_nuevo VARCHAR(100),
    color_nombre_anterior VARCHAR(50),
    color_nombre_nuevo VARCHAR(50),
    precio_compra_anterior DECIMAL(10,2),
    precio_compra_nuevo DECIMAL(10,2),
    precio_venta_anterior DECIMAL(10,2),
    precio_venta_nuevo DECIMAL(10,2),
    cantidad_anterior INT,
    cantidad_nueva INT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos_base(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

DELIMITER //

CREATE TRIGGER after_update_producto
AFTER UPDATE ON productos_base
FOR EACH ROW
BEGIN
    -- Solo registrar si hubo un cambio real en alguno de los valores monitoreados
    IF OLD.nombre != NEW.nombre OR
       OLD.color_nombre != NEW.color_nombre OR
       OLD.precio_compra != NEW.precio_compra OR
       OLD.precio_venta != NEW.precio_venta OR
       OLD.cantidad != NEW.cantidad THEN
       
        INSERT INTO auditoria_productos (
            producto_id,
            nombre_anterior, nombre_nuevo,
            color_nombre_anterior, color_nombre_nuevo,
            precio_compra_anterior, precio_compra_nuevo,
            precio_venta_anterior, precio_venta_nuevo,
            cantidad_anterior, cantidad_nueva,
            usuario_id
        ) VALUES (
            OLD.id_producto,
            OLD.nombre, NEW.nombre,
            OLD.color_nombre, NEW.color_nombre,
            OLD.precio_compra, NEW.precio_compra,
            OLD.precio_venta, NEW.precio_venta,
            OLD.cantidad, NEW.cantidad,
            (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1)
        );
    END IF;
END;
//

DELIMITER ;

CREATE TABLE auditoria_eliminacion_productos (
    id_auditoria_eliminacion INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    nombre VARCHAR(100),
    color_nombre VARCHAR(50),
    codigo_pintura VARCHAR(50),
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    cantidad INT,
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

DELIMITER //

CREATE TRIGGER before_delete_producto
BEFORE DELETE ON productos_base
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_eliminacion_productos (
        producto_id,
        nombre,
        color_nombre,
        codigo_pintura,
        precio_compra,
        precio_venta,
        cantidad,
        usuario_id
    ) VALUES (
        OLD.id_producto,
        OLD.nombre,
        OLD.color_nombre,
        OLD.codigo_pintura,
        OLD.precio_compra,
        OLD.precio_venta,
        OLD.cantidad,
        (SELECT id_usuario FROM usuarios WHERE email = CURRENT_USER() LIMIT 1)
    );
END;
//

DELIMITER ;