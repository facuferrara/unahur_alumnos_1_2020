'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
    
    materia.belongsTo(models.carrera,{ // modelo al que pertenece a carrera
      
        as: 'Carrera-Relacionada',  // nombre de mi relación
        foreignKey: 'id_carrera'   // campo con el que voy a igualar
      })
      
    materia.belongsTo(models.profesores,{ // modelo al que pertenece
      
        as : 'Profesor-Relacionado',  // nombre de la relación
        foreignKey: 'id_profesor'     // campo con el que voy a igualar
      });
  };
  return materia;
};
