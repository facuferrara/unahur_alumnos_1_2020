'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('materia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
<<<<<<< HEAD:api/migrations/2-create-materia.js
      id_carrera: { //seteo el atributo junto con su tipo + las referencias del 
                    //modelo referido y su clave primaria
          type: Sequelize.INTEGER,
          references:{
              model: 'carreras',
              key: 'id'
          }
=======
      id_carrera: {
        type: Sequelize.INTEGER
>>>>>>> 0b0c21dc06f0c842235ef5fdb08539490931389e:api/migrations/20201006022743-create-materia.js
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
    return queryInterface.dropTable('materia');
  }
};