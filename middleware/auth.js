const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
   // console.log(req.headers); // authorization: 'Bearer eyJhbGc...
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('No token provided');
   }

   const token = authHeader.split(' ')[1];

   //decodificando token
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, username } = decoded;
      // 📌
      req.user = { id, username };

      next();
   } catch (error) {
      throw new UnauthenticatedError('Not authorized to access this route');
   }
};

module.exports = authenticationMiddleware;

// 📌 los destructura del decoded y le crea la prop user al req para meterle el id y username, entonce asi, en el controller en el req se va a tener acceso al req con la informacion
// recordar q en routes/main.js tengo "router.route('/dashboard').get(authMiddleware, dashboard)" x lo q el next() pasa al dashboard ( de controllers )
