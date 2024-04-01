'use strict';
const { userStat } = require('../models');
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {

  async up(queryInterface, Sequelize) {

    await userStat.bulkCreate([
      {
        userId: 1,
        health: 50,
        experience: 100,
        heroClass: 'Warrior'
      },
      {
        userId: 2,
        health: 125,
        experience: 187,
        heroClass: 'Mage'
      },
      {
        userId: 3,
        health: 210,
        experience: 500,
        heroClass: 'Warrior'
      },
    ], options, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'userStats';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
