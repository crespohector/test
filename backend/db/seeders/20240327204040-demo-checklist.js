'use strict';
const { Checklist } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Checklist.bulkCreate([
      {
        taskId: 1,
        userId: 1,
        checklistItem: 'Finished two loads of clothing',
        checked: false,
      },
      {
        taskId: 1,
        userId: 1,
        checklistItem: 'Folded all loads',
        checked: false,
      },
      {
        taskId: 4,
        userId: 2,
        checklistItem: 'Started with dinner at 5pm',
        checked: false,
      },
      {
        taskId: 4,
        userId: 2,
        checklistItem: 'Got half of dish load done',
        checked: false,
      },
      {
        taskId: 7,
        userId: 2,
        checklistItem: 'Reviewed prologue',
        checked: false,
      },
      {
        taskId: 7,
        userId: 3,
        checklistItem: 'Introduced two characters within two chapters',
        checked: false,
      },
      {
        taskId: 8,
        userId: 3,
        checklistItem: 'Wrote down morning routine for all weekdays',
        checked: false,
      },
      {
        taskId: 2,
        userId: 1,
        checklistItem: 'Included burpees',
        checked: false,
      },
    ], options, { validate: true })

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Checklists';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
