// check username & password in post(login) request, estaria disponibles en req.body
// if both exist => create a new JWT, q se envia al front para q pueda hacer el get request al "dashboard" y obtener el secret number ( only the request with JWT can access the dashboard )
// if not => send back to front con respuesta 'please send email & pass'

// si se logea o registra, solo entonces puede hacer el get para obtener el secret num, sino, se envia al front el mensaje de q necesita logearse o registrarse

// la ruta dashboard va a estar restringida solo para los autenticados, q son los requests q tengan presente el JWT

const login = async (req, res) => {
   const { username, password } = req.body;
   console.log(username, password);

   res.send('Fake Login/Register/Signup Route');
};

const dashboard = async (req, res) => {
   const luckyNumber = Math.floor(Math.random() * 100);

   res.status(200).json({
      msg: 'Hello, John Doe',
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
   });
};

module.exports = { login, dashboard };
