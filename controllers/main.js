// check username & password in post(login) request, estaria disponibles en req.body
// if both exist => create a new JWT, q se envia al front para q pueda hacer el get request al "dashboard" y obtener el secret number ( only the request with JWT can access the dashboard )
// if not => send back to front con respuesta 'please send email & pass'

// si se logea o registra, solo entonces puede hacer el get para obtener el secret num, sino, se envia al front el mensaje de q necesita logearse o registrarse

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
   console.log(req.headers); // authorization: 'Bearer eyJhbGc...
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomAPIError('No token provided', 401);
   }

   const token = authHeader.split(' ')[1];

   //decodificando token
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      const luckyNumber = Math.floor(Math.random() * 100);

      res.status(200).json({
         msg: `Hello ${decoded.username}`,
         secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
      });
   } catch (error) {
      throw new CustomAPIError('Not authorized to access this route', 401);
   }
};

module.exports = { login, dashboard };
