-- =====================================================================
-- Computer Shop - MySQL Database Schema
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'ADMIN',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS categories (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name        VARCHAR(120) NOT NULL UNIQUE,
    slug        VARCHAR(140) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(60),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories (slug);

CREATE TABLE IF NOT EXISTS products (
    id                CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name              VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL UNIQUE,
    category_id       CHAR(36) NOT NULL,
    brand             VARCHAR(120) NOT NULL,
    model             VARCHAR(120) NOT NULL,
    price             DECIMAL(12,2) NOT NULL,
    stock_quantity    INT NOT NULL DEFAULT 0,
    short_description VARCHAR(300) NOT NULL,
    description       TEXT NOT NULL,
    features          JSON NOT NULL DEFAULT ('[]'),
    specifications    JSON NOT NULL DEFAULT ('{}'),
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_products_created_at ON products (created_at DESC);
CREATE INDEX idx_products_price ON products (price);
CREATE INDEX idx_products_is_featured ON products (is_featured);
CREATE INDEX idx_products_is_active ON products (is_active);

CREATE TABLE IF NOT EXISTS product_images (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id  CHAR(36) NOT NULL,
    image_url   TEXT NOT NULL,
    is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product_id ON product_images (product_id);

CREATE TABLE IF NOT EXISTS orders (
    id               CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_number     VARCHAR(32) NOT NULL UNIQUE,
    customer_name    VARCHAR(120) NOT NULL,
    customer_email   VARCHAR(160) NOT NULL,
    customer_phone   VARCHAR(40) NOT NULL,
    status           ENUM('NEW','CONFIRMED','PROCESSING','READY','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NEW',
    subtotal         DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes            TEXT,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
    id             CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id       CHAR(36) NOT NULL,
    product_id     CHAR(36) NOT NULL,
    product_name   VARCHAR(200) NOT NULL,
    product_slug   VARCHAR(220) NOT NULL,
    unit_price     DECIMAL(12,2) NOT NULL,
    quantity       INT NOT NULL,
    line_total     DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
