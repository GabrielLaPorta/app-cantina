const express = require("express");
const app = express();
const Database = require("./db/Database")
const ProductController = require("./api/controller/ProductController");
const OrderController = require("./api/controller/OrderController");

const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});


app.use('/api/products', ProductController);
app.use('/api/orders', OrderController);

app.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

app.listen(8000, () => {
  console.log(`localhost rodando na porta 8000`);
  Database.connectDB()
});

