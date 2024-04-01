'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
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
      statId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Stats',
          key: 'id'
        },
      },
      itemName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      itemType: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      healthBoost: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      statBoost: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gear: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      wep: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      equipped: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      description: {
        type: Sequelize.STRING(250),
        allowNull: false
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
    options.tableName = 'Inventories'
    return queryInterface.dropTable(options);
  }
};
