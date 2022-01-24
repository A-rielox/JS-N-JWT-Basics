// la ruta dashboard va a estar restringida solo para los autenticados, q son los requests q tengan presente el JWT
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const login = async (req, res) => {
   const { username, password } = req.body;
   console.log(username, password);

   if (!username || !password) {
      throw new CustomAPIError('please provide usename & password', 400);
      // como estoy ocupando 'express-async-errors' => este error se pasa directo a "errorHandlerMiddleware"
   }

   // JWT RELATED
   // just demo, normally provided by DB
   const id = new Date().getTime();

   // 1er param es el payload ( NO PASAR PASSWORDS ), mantenerlos lo más pequeños posible
   // 2do el jwt secret, se guarda en el .env, este secreto es con el q se firma el token y x eso es q se mantiene solo en el server en en .env, sino cualquier otro puede empezar a firmar tokens
   // 3ro opciones, en este caso q expira en 30 dias.
   const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
   });

   res.status(200).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
   console.log(req.user);
   const luckyNumber = Math.floor(Math.random() * 100);
   // 📌
   res.status(200).json({
      msg: `Hello ${req.user.username}`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
   });
};

module.exports = { login, dashboard };

// 📌 en el middleware auth, q es el middleware q se agarra antes de pasar a dashboard, se crea la prop user en el req y se le pasa { id, username }
