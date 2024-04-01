'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userStats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:
        {
          model: 'Users'
        },
        onDelete: 'CASCADE'
      },
      health: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 50
      },
      experience: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      heroClass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'userStats'
    await queryInterface.dropTable(options)
  }
};
