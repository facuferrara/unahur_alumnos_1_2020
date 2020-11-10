var express = require("express");
var router = express.Router();
var models = require("../models");
// para crear el modelo
//npx sequelize-cli model:generate --name materias -- attributes nombre:string,id_carrera:integer
//req es un objeto que contiene información sobre la solicitud HTTP que generó el evento y res devuelve la respuesta http deseadaf  1|  
router.get("/", (req, res) => {//orm interfaz mas amigable para trabajar con la DB
  
  const limite = (parseInt(req.query.cantAver) ? parseInt(req.query.cantAver) : 3 );//lo que pasa por parametro lo pasa a integer, 
  //la req devuelve las variables del formulario,
  // y con query saco las variables de la direccion,
  // con el signo es un ternario(if simplif), lo de la izq es la condicion, lo de la derecha si es afirmativo y separado por dos puntos, lo que es falso.
  
  const off = (req.query.paginaActual ? limite*(parseInt(req.query.paginaActual)-1) : 0);

  models.materia
    .findAll({//me trae los atributos seleccionados(este provee methods accede a todos los elementos de la tabla)
      offset : off,
      limit: limite,
      attributes: ["id", "nombre","id_carrera"],
      //incluyo una tabla relacional
      include:[{ 
        as:'Carrera-Relacionada', 
        model:models.carrera, 
        attributes: ["id","nombre"]
      }]
    })
    .then(materia => {res.send(materia)})
    .catch((e) => {
      console.log(e);
      res.sendStatus(500)});
});
//------------
router.post("/", (req, res) => {
  models.materia
    .create({ //insercion de un dato seleccionado
      nombre: req.body.nombre,
      id_carrera: req.body.id_carrera
    })
    .then(materias => res.status(201).send({ id: materias.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    })
    ;
});

  const findMateria = (id, { onSuccess, onNotFound, onError }) => {
    models.materia
      .findOne({
        attributes: ["id", "nombre", "id_carrera"],
        where: { id }
      })
      .then(materias => (materias ? onSuccess(materias) : onNotFound()))
      .catch(() => onError());
  };

  router.get("/:id", (req, res) => {
    findMateria(req.params.id, {
      onSuccess: materias => res.send(materias),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  //para actualizar
  //ok
  router.put("/:id", (req, res) => {
    const onSuccess = materia =>
    materia
        .update(
          { nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre","id_carrera"] }
          )
        .then(() => res.sendStatus(200))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otra materia con el mismo nombre')
          }
          else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
        findMateria(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  //ok
  router.delete("/:id", (req, res) => {
    const onSuccess = materias =>
    materias
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findMateria(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });

module.exports = router;