const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'ourgoods.db');

function initDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      createTables(db);
    }
  });
  return db;
}

function createTables(db) {
  db.serialize(() => {
    // Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        slug TEXT,
        description TEXT,
        regular_price REAL,
        sale_price REAL,
        currency TEXT,
        converted_price_bdt REAL,
        source_url TEXT,
        source_platform TEXT,
        supplier_price REAL,
        exchange_rate REAL,
        weight REAL,
        shipping_charge REAL,
        product_type TEXT,
        category_id TEXT,
        subcategory_id TEXT,
        brand TEXT,
        status TEXT,
        import_status TEXT,
        import_warning TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Product Images Table
    db.run(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        image_url TEXT,
        is_main BOOLEAN,
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `);

    // Product Variants Table
    db.run(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        color TEXT,
        size TEXT,
        price REAL,
        stock INTEGER,
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `);

    // Product Import Logs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS product_import_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        platform TEXT,
        status TEXT,
        imported_product_id INTEGER,
        raw_response TEXT,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database tables initialized.');
  });
}

module.exports = { initDatabase };
