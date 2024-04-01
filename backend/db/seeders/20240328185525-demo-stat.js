'use strict';
const { Stat } = require('../models');
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await Stat.bulkCreate([
      {
        userId: 1,
        strength: 100,
        magic: 50,
        physicalDefense: 100,
        magicDefense: 50,
        luck: 50
      },
      {
        userId: 2,
        strength: 50,
        magic: 100,
        physicalDefense: 50,
        magicDefense: 100,
        luck: 50
      },
      {
        userId: 3,
        strength: 100,
        magic: 50,
        physicalDefense: 100,
        magicDefense: 50,
        luck: 50
      },
    ], options, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Stats';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
