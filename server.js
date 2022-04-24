import express, { Router } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL("./db/maceira-backend-firebase-adminsdk.json", import.meta.url)
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

config();

const app = express();
const route_products = Router();
const route_cart = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.ENVIRONMENT === "production" ? process.env.PORT : 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

const APIPRODROUTE = "/api/productos";
const APICARTROUTE = "/api/carrito";

let db;
let carts;

switch (process.env.NODE_DB_TYPE) {
  case "archivo": {
    console.log(process.env.NODE_DB_TYPE, "ARCHIVO");
    const { default: ProductosDAOArchivo } = await import(
      "./classes/daos/productos/ProductosDAOArchivo.js"
    );
    const { default: CarritosDAOArchivo } = await import(
      "./classes/daos/productos/ProductosDAOArchivo.js"
    );
    db = new ProductosDAOArchivo("./db/productos.txt");
    carts = new CarritosDAOArchivo("./db/carritos.txt");
    break;
  }
  case "firebase": {
    console.log(process.env.NODE_DB_TYPE, "FIREBASE");
    const { default: ProductosDAOFirebase } = await import(
      "./classes/daos/productos/ProductosDAOFirebase.js"
    );
    const { default: CarritosDAOFirebase } = await import(
      "./classes/daos/carritos/CarritosDAOFirebase.js"
    );
    db = new ProductosDAOFirebase();
    carts = new CarritosDAOFirebase();
    break;
  }
  case "memoria": {
    console.log(process.env.NODE_DB_TYPE, "MEMORIA");
    const { default: ProductosDAOMemoria } = await import(
      "./classes/daos/productos/ProductosDAOMemoria.js"
    );
    const { default: CarritosDAOMemoria } = await import(
      "./classes/daos/carritos/CarritosDAOMemoria.js"
    );
    db = new ProductosDAOMemoria();
    carts = new CarritosDAOMemoria();
    break;
  }
  case "mongodb": {
    console.log(process.env.NODE_DB_TYPE, "MONGODB");
    const { default: ProductosDAOMongoDB } = await import(
      "./classes/daos/productos/ProductosDAOMongoDB.js"
    );
    const { default: CarritosDAOMongoDB } = await import(
      "./classes/daos/carritos/CarritosDAOMongoDB.js"
    );
    db = new ProductosDAOMongoDB();
    carts = new CarritosDAOMongoDB();
    break;
  }
  default: {
    console.log(process.env.NODE_DB_TYPE, "DEFAULT");
    const { default: ProductosDAOFirebase } = await import(
      "./classes/daos/productos/ProductosDAOFirebase.js"
    );
    const { default: CarritosDAOFirebase } = await import(
      "./classes/daos/carritos/CarritosDAOFirebase.js"
    );
    db = new ProductosDAOFirebase();
    carts = new CarritosDAOFirebase();
    break;
  }
}

app.use(APIPRODROUTE, route_products);
app.use(APICARTROUTE, route_cart);
app.use("/static", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
route_products.use(express.json());
route_products.use(express.urlencoded({ extended: true }));
route_cart.use(express.json());
route_cart.use(express.urlencoded({ extended: true }));

app.use("*", function (req, res) {
  res.sendStatus = 404;
  res.send({ error: -2, descripcion: "ruta no implementada" });
});

route_products.get("/:id?", async (req, res) => {
  try {
    const id = req.params.id;

    if (id) {
      const product = await db.getById(id);
      res.send(product);
    } else {
      const products = await db.getAll();
      res.send(products);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

route_products.post("/", async (req, res) => {
  if (req.body.administrador) {
    try {
      const newProduct = await db.save(req.body.item);
      res.send({ id: newProduct });
    } catch (err) {
      res.statusCode = 400;
      res.send(err.message);
    }
  } else {
    res.statusCode = 400;
    res.send({
      error: -1,
      descripcion: "ruta '/', método 'POST' no autorizado",
    });
  }
});

route_products.put("/:id", async (req, res) => {
  if (req.body.administrador) {
    try {
      await db.updateItem(req.params.id, req.body.item);
      res.send("El producto fue actualizado exitosamente!");
    } catch (err) {
      res.statusCode = 400;
      res.send(err.message);
    }
  } else {
    res.statusCode = 400;
    res.send({
      error: -1,
      descripcion: `ruta '${APIPRODROUTE}/${req.params.id}', método 'PUT' no autorizado`,
    });
  }
});

route_products.delete("/:id", async (req, res) => {
  if (req.body.administrador) {
    try {
      await db.deleteById(req.params.id);
      res.send("El producto fue borrado exitosamente!");
    } catch (err) {
      res.statusCode = 400;
      res.send(err.message);
    }
  } else {
    res.statusCode = 400;
    res.send({
      error: -1,
      descripcion: `ruta '${APIPRODROUTE}/${req.params.id}', método 'DELETE' no autorizado`,
    });
  }
});

route_cart.post("/", async (req, res) => {
  try {
    const newCart = await carts.save();
    res.send({ id: newCart });
  } catch (err) {
    res.statusCode = 400;
    res.send(err.message);
  }
});

route_cart.delete("/:id", async (req, res) => {
  try {
    await carts.deleteById(req.params.id);
    res.send("El carrito fue vaciado y borrado exitosamente!");
  } catch (err) {
    res.statusCode = 400;
    res.send(err.message);
  }
});

route_cart.get("/:id/productos", async (req, res) => {
  try {
    const id = req.params.id;

    if (id) {
      const productsInCart = await carts.getById(id);
      res.send(productsInCart);
    } else {
      throw new Error("El id es invalido");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

route_cart.post("/:id/productos", async (req, res) => {
  try {
    const id = req.params.id;
    const idItem = req.body.item.id;

    if (id && idItem) {
      const item = await db.getById(idItem);

      await carts.addProduct(id, item);
      res.send("Item agregado.");
    } else {
      throw new Error("Revisar los ids ingresados");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

route_cart.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    const id = req.params.id;
    const idItem = req.params.id_prod;

    if (id && idItem) {
      await carts.deleteProductInCart(id, idItem);
      res.send("Item borrado del carrito.");
    } else {
      throw new Error("Revisar los ids ingresados");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
