var express = require("express");
var router = express.Router();
var models = require("../models");

// para crear el modelo
//npx sequelize-cli model:generate --name materias -- attributes nombre:string,id_carrera:integer
//?paginaActual=2&cantAver=2

router.get("/", (req, res) => {

  const limite = (parseInt(req.query.cantAver) ? parseInt(req.query.cantAver) : 10 );
  const off = (req.query.paginaActual ? limite*(parseInt(req.query.paginaActual)-1) : 0);
  
  models.alumno
    .findAll({//me trae los atributos seleccionados(este provee methods accede a todos los elementos de la tabla)
      offset : off,
      limit: limite,
      attributes: ["id", "nombre", "apellido","id_carrera"],
      include: [{ 
        as:"Alumno-Relacionado", 
        model:models.carrera, 
        attributes: ["id","nombre"]
      }]
    })
    .then(alumno => res.send(alumno))
    //retorna una Promesa. Recibe dos argumentos: funciones callback  para los casos de éxito y fallo de Promise.
    .catch(() => res.sendStatus(500) );
    //solo se ejecuta en los casos en los que la promesa se marca como Reject(es decir si hay un error tira el status 500)
});
//-----------------------
router.post("/", (req, res) => {
  models.alumno
    .create({ 
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      id_carrera: req.body.id_carrera
    })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});
//ok
const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id","nombre", "apellido","id_carrera"],
      where: { id }
    })
    .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
    .catch(() => onError());
};

//get con atributo 
router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});


//para actualizar
//
router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({ 
        nombre: req.body.nombre, 
        apellido: req.body.apellido, 
        id_carrera: req.body.id_carrera
      },
        {
          fields: ["nombre", "apellido", "id_carrera"] 
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
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

//ok
router.delete("/:id", (req, res) => {
  const onSuccess = alumnos =>
  alumnos
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
