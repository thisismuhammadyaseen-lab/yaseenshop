require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yaseenshop",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "yaseenshop_db",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "YaseenShop backend and database connected!"
    });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed."
    });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT id, name, price, category, rating, description FROM products ORDER BY id"
    );
    res.json({ success: true, products });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Products load nahi ho sake."
    });
  }
});

app.post("/api/orders", async (req, res) => {
  const { name, phone, address, city, items } = req.body || {};

  if (![name, phone, address, city].every(
    value => typeof value === "string" && value.trim()
  )) {
    return res.status(400).json({
      success: false,
      message: "Name, phone, address aur city zaroori hain."
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart khaali hai."
    });
  }

  const normalized = [];
  for (const item of items) {
    const id = Number(item.id);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 || quantity > 99) {
      return res.status(400).json({
        success: false,
        message: "Product ya quantity ghalat hai."
      });
    }

    normalized.push({ id, quantity });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let total = 0;
    const verifiedItems = [];

    for (const item of normalized) {
      const [rows] = await connection.query(
        "SELECT id, name, price FROM products WHERE id = ?",
        [item.id]
      );

      if (!rows.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Product nahi mila."
        });
      }

      const product = rows[0];
      const subtotal = Number(product.price) * item.quantity;
      total += subtotal;

      verifiedItems.push({
        ...product,
        quantity: item.quantity,
        subtotal
      });
    }

    const [order] = await connection.query(
      "INSERT INTO orders (customer_name, phone, address, city, total, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
      [name.trim(), phone.trim(), address.trim(), city.trim(), total]
    );

    for (const item of verifiedItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          order.insertId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.subtotal
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order database mein save ho gaya!",
      orderId: order.insertId,
      total
    });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }

    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Order save nahi hua. Backend logs check karo."
    });
  } finally {
    if (connection) connection.release();
  }
});


function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Admin login zaroori hai."
    });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Session invalid ya expire ho gaya. Dobara login karo."
    });
  }
}

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password) {
    return res.status(400).json({
      success: false,
      message: "Username aur password likho."
    });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1",
      [username.trim()]
    );

    if (!rows.length ||
        !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({
        success: false,
        message: "Username ya password ghalat hai."
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET .env mein set nahi hai.");
      return res.status(503).json({
        success: false,
        message: "Server security configuration missing hai."
      });
    }

    const token = jwt.sign(
      { adminId: rows[0].id, username: rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: rows[0].id,
        username: rows[0].username
      }
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login abhi kaam nahi kar raha."
    });
  }
});

app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT id, customer_name, phone, address, city, total, status, created_at FROM orders ORDER BY id DESC"
    );

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Orders load nahi ho sake."
    });
  }
});

app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  if (!Number.isInteger(id) || id < 1 ||
      !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Order ID ya status ghalat hai."
    });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Order nahi mila."
      });
    }

    return res.json({
      success: true,
      message: "Order status update ho gaya."
    });
  } catch (error) {
    console.error("Order status update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Status update nahi ho saka."
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`YaseenShop backend: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
