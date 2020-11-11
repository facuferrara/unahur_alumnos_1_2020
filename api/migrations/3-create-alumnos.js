'use strict';
const carrera = require("../models/carrera.js");
module.exports = {
  
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('alumnos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      apellido: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_carrera: { //seteo el atributo junto con su tipo + las referencias del 
        //modelo referido y su clave primaria
        type: Sequelize.INTEGER,
        references:{
        model: 'carreras',
        key: 'id'
        }
      },
      id_profesor: { //seteo el atributo junto con su tipo + las referencias del 
        //modelo referido y su clave primaria
        type: Sequelize.INTEGER,
        references:{
        model: 'profesor',
        key: 'id'
        }
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('alumnos');
  }
};