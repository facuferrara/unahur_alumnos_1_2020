var express = require("express");
var router = express.Router();
var models = require("../models");
//-----
router.get("/", (req, res) => {
    console.log(req.query);
    const limite = (parseInt(req.query.cantAver) ? parseInt(req.query.cantAver) : 10 );
    const off = (req.query.paginaActual ? limite*(parseInt(req.query.paginaActual)-1) : 0);

  models.profesores
    .findAll({
      offset : off,
      limit: limite,
      attributes: ["id","nombre","apellido", "id_materia"],
      include:[{
          as:'Materia-Relacionada',
          model:models.materia,
          attributes: ["id","nombre"]
      }]
    })
    .then(profesor => res.send(profesor))
    .catch(() => res.sendStatus(500));
});

//----
router.post("/", (req, res) => {
  models.profesores
    .create({nombre: req.body.nombre, id_materia: req.body.id_materia})
    .then(profesores => res.status(201).send({ id: profesores.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra profesor con el mismo nombre');
      }else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesores
    .findOne({
      attributes: ["id", "nombre", "id_materia"],
      where: { id }
    })
    .then(profe => (profe ? onSuccess(profe) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: profe => res.send(profe),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});


//----
router.put("/:id", (req, res) => {
  const onSuccess = profe =>
  profe
      .update({ 
        nombre: req.body.nombre, 
        apellido: req.body.apellido, 
        id_materia: req.body.id_carrera
      },
        {
          fields: ["nombre", "apellido", "id_materia"] 
        })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

//ok
router.delete("/:id", (req, res) => {
  const onSuccess = profe =>
  profe
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;