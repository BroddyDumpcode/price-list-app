
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if(err){
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

function verifyToken(req, res, next){
  const token = req.headers.authorization;

  if(!token){
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err){
      return res.status(401).json({
        message: "Invalid Token"
      });
    }

    req.user = decoded;
    next();
  });
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, result) => {

      if(result.length === 0){
        return res.status(400).json({
          message: "User tidak ditemukan"
        });
      }

      const user = result[0];

      const valid = await bcrypt.compare(password, user.password);

      if(!valid){
        return res.status(400).json({
          message: "Password salah"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        process.env.JWT_SECRET
      );

      res.json({
        token
      });
    }
  );
});

app.get("/products", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY id DESC",
    (err, result) => {
      res.json(result);
    }
  );
});

app.post("/products", verifyToken, (req, res) => {
  const { name, price } = req.body;

  db.query(
    "INSERT INTO products(name, price) VALUES(?, ?)",
    [name, price],
    (err, result) => {
      res.json({
        message: "Produk berhasil ditambah"
      });
    }
  );
});

app.put("/products/:id", verifyToken, (req, res) => {
  const { name, price } = req.body;

  db.query(
    "UPDATE products SET name=?, price=? WHERE id=?",
    [name, price, req.params.id],
    (err, result) => {
      res.json({
        message: "Produk berhasil diupdate"
      });
    }
  );
});

app.delete("/products/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      res.json({
        message: "Produk berhasil dihapus"
      });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on Port " + process.env.PORT);
});
