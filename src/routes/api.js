import express from 'express';
import Product from '../class/product.js';
import { contents } from '../modules/app.js';
import { products, dbIDs, lastID } from '../modules/data.js';

const router = express.Router();

//Creando algunos products para pruebas
//Comentar para verificar el error de no existen products.
for (let id = 1; id <= 4; id++) {
  const objDatos = contents();
  const objProduct = new Product(
    objDatos.title,
    objDatos.price,
    objDatos.thumbnail,
    id
  );
  products.push(objProduct);
  dbIDs.push(id);
  lastID.lastID = id;
}

/**
 * DEFINICION RUTAS BASICAS
 */

//Ruta para Listar todos los Product existentes
router.get('/products/list', (req, res) => {
  if (products.length < 1) {
    return res.status(400).json({
      error: 'No hay products cargados',
    });
  }

  res.json({
    products,
  });
});

//Ruta para listar un Product especifico por su id
router.get('/products/list/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (id < dbIDs[0] || id > dbIDs[dbIDs.length - 1]) {
    return res.status(400).json({
      error: 'Product no found',
    });
  }

  const indexID = dbIDs.findIndex((ID) => ID === id);
  if (indexID === -1) {
    return res.status(400).json({
      error: 'Product no found',
    });
  }

  const product = products[indexID];
  res.json({
    product,
  });
});

//Ruta para guardar un Product nuevo si se cumplen los parámetros necesarios.
router.post('/save', (req, res) => {
  const body = req.body;
  const msgErrorParametros = 'Invalid parameters';
  const errorSave = (msg) => {
    return res.status(400).json({
      error: msg,
    });
  };

  if (body.title === undefined) {
    errorSave('undefined title');
  }

  if (body.price === undefined) {
    errorSave('undefined price');
  }

  if (isNaN(parseFloat(body.price))) {
    errorSave('letter price');
  }

  if (body.thumbnail === undefined) {
    errorSave('Without image');
  }

  lastID.lastID = lastID.lastID + 1; // Se incrementa el lastID.lastID por que se va a guarda un nuevo valor.

  const objProduct = new Product(
    body.title,
    body.price,
    body.thumbnail,
    lastID.lastID
  );
  products.push(objProduct);
  dbIDs.push(lastID.lastID);

  //Validando si el guarda es usado desde el form o via json/api
  if (body.form === 'true') {
    //Deprecated el form no se usa desde un submit, se reemplaza por websocket
    res.redirect(301, '/');
  } else {
    res.json({
      objProduct,
    });
  }
});

//Ruta para actualizar un Product si se cumplen los parámetros necesarios.
router.put('/products/actualizar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const msgErrorID = 'Product no encontrado';
  const msgErrorParametros = 'Parámetros no validos';
  let flagUpdate = true;

  const errorSave = (msg) => {
    return res.status(400).json({
      error: msg,
    });
  };

  if (id < dbIDs[0] || id > dbIDs[dbIDs.length - 1]) {
    flagUpdate = false;
    errorSave(msgErrorID);
  }

  const indexID = dbIDs.findIndex((ID) => ID === id);
  if (indexID === -1) {
    flagUpdate = false;
    errorSave(msgErrorID);
  }

  if (body.title === undefined) {
    flagUpdate = false;
    errorSave(msgErrorParametros);
  }

  if (body.price === undefined) {
    flagUpdate = false;
    errorSave(msgErrorParametros);
  }

  if (isNaN(parseFloat(body.price))) {
    flagUpdate = false;
    errorSave(msgErrorParametros);
  }

  if (body.thumbnail === undefined) {
    flagUpdate = false;
    errorSave(msgErrorParametros);
  }

  if (flagUpdate) {
    products[indexID].title = body.title;
    products[indexID].price = body.price;
    products[indexID].thumbnail = body.thumbnail;
    const objProduct = products[indexID];

    res.json({
      objProduct,
    });
  }
});

//Ruta encargada de eliminar un Product
router.delete('/products/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const msgErrorID = 'Product no found';
  let flagDelete = true;

  const errorSave = (msg) => {
    return res.status(400).json({
      error: msg,
    });
  };

  if (id < dbIDs[0] || id > dbIDs[dbIDs.length - 1]) {
    flagDelete = false;
    errorSave(msgErrorID);
  }

  let indexID = dbIDs.findIndex((ID) => ID === id);
  if (indexID === -1) {
    flagDelete = false;
    errorSave(msgErrorID);
  }

  if (flagDelete) {
    const product = products[indexID];
    products.splice(indexID, 1);
    dbIDs.splice(indexID, 1);

    res.json({
      product,
    });
  }
});

export default router;
