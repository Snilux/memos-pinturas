CREATE DATABASE IF NOT EXISTS memos_pinturas;
DROP database memos_pinturas;
USE memos_pinturas;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Operador', 'Cliente') NOT NULL
);

-- Tabla de Proveedores
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);
-- No tiene productos ni complementos
-- Tabla de Lotes
CREATE TABLE lotes (
    id_lote INT AUTO_INCREMENT PRIMARY KEY,
    codigo_trazabilidad VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INT,
    fecha_llegada DATE NOT NULL,
    fecha_caducidad DATE NUll,
    descripcion varchar(255) NOT NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor) ON DELETE SET NULL
);
-- nombreProducto, borrar cantidad_caja, agregar campo de foto
-- Tabla base para productos
CREATE TABLE productos_base (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color_nombre VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    codigo_pintura VARCHAR(50) NOT NULL,
    cantidad_caja INT NOT NULL,
    cantidad_litros DECIMAL(10,2) NOT NULL,
    lote_id INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    imagen text NULL,
    FOREIGN KEY (lote_id) REFERENCES lotes(id_lote) ON DELETE CASCADE
);

-- Tablas de cada categoría con subcategorías
CREATE TABLE pinturas_arquitectonicas LIKE productos_base;
ALTER TABLE pinturas_arquitectonicas ADD COLUMN subcategoria ENUM('Vinílicas', 'Selladores', 'Esmaltes', 'Primarios Anticorrosivos', 'Impermeabilizantes', 'Impermeabilizantes Asfálticos', 'Impermeabilizantes Para Muros') NOT NULL;
ALTER TABLE pinturas_arquitectonicas ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;
describe pinturas_arquitectonicas;

CREATE TABLE pinturas_en_aerosol LIKE productos_base;
ALTER TABLE   pinturas_en_aerosol ADD COLUMN  subcategoria ENUM('Aerosoles') NOT NULL;
ALTER TABLE pinturas_en_aerosol ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;
describe pinturas_arquitectonicas;

CREATE TABLE adhesivos_y_colorantes LIKE productos_base;
ALTER TABLE adhesivos_y_colorantes ADD COLUMN subcategoria ENUM('Adhesivos', 'Color Para Cemento') NOT NULL;
ALTER TABLE adhesivos_y_colorantes ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;


CREATE TABLE pinturas_industriales LIKE productos_base;
ALTER TABLE pinturas_industriales ADD COLUMN subcategoria ENUM('Línea Industrial') NOT NULL;
ALTER TABLE pinturas_industriales ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;


CREATE TABLE pinturas_automotrices LIKE productos_base;
ALTER TABLE pinturas_automotrices ADD COLUMN subcategoria ENUM('Línea Automotriz', 'Primers Y Rellenadores', 'Plaste Automotivo', 'Perlas Universales Xiralicas', 'Reductores Y Solventes', 'Endurecedores Y Aditivos', 'Transparentes') NOT NULL;
ALTER TABLE pinturas_automotrices ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;

CREATE TABLE pinturas_para_madera LIKE productos_base;
ALTER TABLE pinturas_para_madera ADD COLUMN subcategoria ENUM('Century Maderas', 'Tintas') NOT NULL;
ALTER TABLE pinturas_para_madera ADD COLUMN nombre_proveedor VARCHAR(50) NOT NULL;

describe pinturas_para_madera;

-- Tabla de Complementos
CREATE TABLE complementos (
    id_complemento INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(100) NOT NULL,
    caracteristicas TEXT NOT NULL,
    cantidad_caja INT NOT NULL,
    precio_caja DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_unitario_venta DECIMAL(10,2) NOT NULL,
    lote_id int NOT NULL,
    cantidad INT NOT NULL,
    imgen TEXT null,
    FOREIGN KEY (lote_id) REFERENCES lotes(id_lote) ON DELETE CASCADE
);

drop table complementos;

-- Tabla de Ventas (puede vender productos o complementos)
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT NULL,
    complemento_id INT NULL,
    cantidad_vendida INT,
    precio_total_venta DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    codigo_trazabilidad VARCHAR(50) UNIQUE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (producto_id) REFERENCES productos_base(id_producto) ON DELETE SET NULL,
    FOREIGN KEY (complemento_id) REFERENCES complementos(id_complemento) ON DELETE SET NULL
);

-- Tabla de Movimientos de Inventario
CREATE TABLE movimientos_inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NULL,
    complemento_id INT NULL,
    usuario_id INT,
    tipo ENUM('Entrada', 'Salida') NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lote_id INT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos_base(id_producto) ON DELETE SET NULL,
    FOREIGN KEY (complemento_id) REFERENCES complementos(id_complemento) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (lote_id) REFERENCES lotes(id_lote) ON DELETE SET NULL
);

-- Tabla de Etiquetas 
CREATE TABLE etiquetas (
    id_etiqueta INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NULL,
    lote_id INT NULL,
    complemento_id INT NULL,
    codigo_qr TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos_base(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (lote_id) REFERENCES lotes(id_lote) ON DELETE CASCADE,
    FOREIGN KEY (complemento_id) REFERENCES complementos(id_complemento) ON DELETE CASCADE
);


-- Disparador para actualizar el inventario tras una venta de productos
DELIMITER //
CREATE TRIGGER after_venta_producto
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    IF NEW.producto_id IS NOT NULL THEN
        UPDATE productos
        SET cantidad = cantidad - 1
        WHERE id = NEW.producto_id;
    END IF;
END;
// DELIMITER ;

-- Disparador para actualizar el inventario tras una venta de complementos
DELIMITER //
CREATE TRIGGER after_venta_complemento
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    IF NEW.complemento_id IS NOT NULL THEN
        UPDATE complementos
        SET cantidad = cantidad - 1
        WHERE id = NEW.complemento_id;
    END IF;
END;
// DELIMITER ;
