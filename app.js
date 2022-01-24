//@@@@@@@@@@@@@@@@@@@@@@@@@ REQUIRES
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const mainRouter = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//@@@@@@@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(express.static('./public'));
app.use(express.json()); // pa acceder al req.body

//routes
app.use('/api/v1', mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//@@@@@@@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 3000;

const start = async () => {
   try {
      app.listen(port, () =>
         console.log(`Server is listening on port ${port}...👍`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();

// en este proy no va a haber conección a DB, pero como sea estan los archivos
