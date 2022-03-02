const { Router } = require("express");
const router = Router();
const artistControllers = require("../controllers/artist/index.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


router.get("/getall", artistControllers.getAll);



module.exports = router;