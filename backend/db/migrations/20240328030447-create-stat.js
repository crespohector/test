'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      strength: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      magic: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      physicalDefense: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      magicDefense: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      luck: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Stats'
    return queryInterface.dropTable(options)
  }
};
