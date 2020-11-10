'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesores = sequelize.define('profesores', {
    nombre: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  profesores.associate = function(models) {
    // associations can be defined here
  };
  return profesores;
};