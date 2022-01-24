const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const authenticationMiddleware = async (req, res, next) => {
   // console.log(req.headers); // authorization: 'Bearer eyJhbGc...
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomAPIError('No token provided', 401);
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
      throw new CustomAPIError('Not authorized to access this route', 401);
   }
};

module.exports = authenticationMiddleware;

// 📌 los destructura del decoded y le crea la prop user al req para meterle el id y username, entonce asi, en el controller en el req se va a tener acceso al req con la informacion
// recordar q en routes/main.js tengo "router.route('/dashboard').get(authMiddleware, dashboard)" x lo q el next() pasa al dashboard ( de controllers )
