'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
    
      materia.belongsTo(models.carrera, // modelo al que pertenece a carrera
        {
          as: 'Carrera-Relacionada',  // nombre de mi relación
          foreignKey: 'id_carrera'   // campo con el que voy a igualar
        })
  };
  return materia;
};
