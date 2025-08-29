CREATE TABLE bodegas (
    id_bodega SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE sucursales (
    id_sucursal SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_bodega INT REFERENCES bodegas(id_bodega)
);

CREATE TABLE monedas (
    id_moneda SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    simbolo VARCHAR(5) NOT NULL
);

CREATE TABLE materiales (
    id_material SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE productos (
    codigo VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    id_bodega INT REFERENCES bodegas(id_bodega),
    id_sucursal INT REFERENCES sucursales(id_sucursal),
    id_moneda INT REFERENCES monedas(id_moneda)
);

CREATE TABLE producto_material (
    id_producto_material SERIAL PRIMARY KEY,
    codigo_producto VARCHAR(15) REFERENCES productos(codigo),
    id_material INT REFERENCES materiales(id_material),
    UNIQUE (codigo_producto, id_material)
);

INSERT INTO bodegas (nombre) VALUES
('Bodega 1'),
('Bodega 2');
('Bodega 3');
('Bodega 4');

INSERT INTO sucursales (nombre, id_bodega) VALUES
('Sucursal 1', 1),
('Sucursal 2', 1),
('Sucursal 3', 2);
('Sucursal 4', 2);
('Sucursal 5', 3);

INSERT INTO monedas (nombre, simbolo) VALUES
('Dólar', 'USD'),
('Euro', 'EUR'),
('Peso chileno', 'CLP');


INSERT INTO materiales (nombre) VALUES
('Plástico'),
('Metal'),
('Madera'),
('Vidrio'),
('Textil');