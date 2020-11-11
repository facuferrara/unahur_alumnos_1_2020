var express = require("express");//responde a las solicitudes de cliente.
var router = express.Router();//enlazado a router 
var models = require("../models");

//SELECT * FROM carrera
router.get("/", (req, res) => {
  const limite = (parseInt(req.query.cantAver) ? parseInt(req.query.cantAver) : 10 );
  const off = (req.query.paginaActual ? limite*(parseInt(req.query.paginaActual)-1) : 0);
  models.carrera
    .findAll({
      offset : off,
      limit: limite,
      attributes: ["id", "nombre"]
    })
    .then(carreras => res.send(carreras))
    //retorna una Promesa. Recibe dos argumentos: funciones callback  para los casos de éxito y fallo de Promise.
    .catch(() => res.sendStatus(500));
    //solo se ejecuta en los casos en los que la promesa se marca como Reject(es decir si hay un error tira el status 500), este retorna una promesa y solo se ejecuta si hay un reject, internamente es lo mismo que llamar al then.
});

//CREATE TABLE [IF NOT EXISTS] table_name(.....)
router.post("/", (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')//esta función acepta un código de parámetro único que contiene el código de estado HTTP.Devuelve un Objeto.
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({                            //Devuelve un solo documento de una colección
      attributes: ["id", "nombre"],
      where: { id }                       //se utiliza para encontrar todos los elementos que coinciden con la condición de búsqueda
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),//con send responde las solicitudes del cliente
    onNotFound: () => res.sendStatus(404),  //no encuentra nada
    onError: () => res.sendStatus(500)      // si hay otro tipo de error
  });
});


//UPDATE employees SET email = 'mary.patterson@classicmodelcars.com'
// WHERE employeeNumber = 1056;

router.put("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre') 
          //indica que el servidor no puede o no procesará la petición debido a algo que es percibido como un error del cliente 
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
          //algo salió mal en el servidor del sitio web
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});


//DELETE FROM table_name, WHERE condition;

router.delete("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
