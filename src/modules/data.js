import { listMessages } from './app.js';

/**
 * DATOS A MANIPULAR
 */
const products = []; //Array de productos
const dbIDs = []; //Array de los IDs de los productos
const lastID = { lastID: 0 }; //Ultimo ID de producto utilizado
const messages = []; //Array de todos los mensajes del chat

//Se verifica si existen mensajes guardados
function checkMessagesOld() {
  let messageOld = JSON.parse(listMessages());
  if (messageOld !== -1) {
    messages.push.apply(messages, messageOld);
  }
}

//Se inicializan los mensajes
checkMessagesOld();
export { products, dbIDs, lastID, messages };
