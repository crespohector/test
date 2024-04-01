'use strict';
const { Inventory } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const resHpPotion = await fetch('https://api.maplestory.net/item/2000000')
    const dataHpPotion = await resHpPotion.json()
    // const resDrgRg = await fetch('https://api.maplestory.net/item/1232010')
    // const dataDrgRg = await resDrgRg.json()
    // const resCrim = await fetch('https://api.maplestory.net/item/1232034')
    // const dataCrim = await resCrim.json()
    // const otherPotion = await fetch('https://api.maplestory.net/item/2000030')
    // const dataOtherPotion = await otherPotion.json()
    // const resMeiRod = await fetch('https://api.maplestory.net/item/1212077')
    // const dataMeiRod = await resMeiRod.json()
    // const resAmeRod = await fetch('https://api.maplestory.net/item/1232034')
    // const dataAmeRod = await resAmeRod.json()
    // const resFirstShield = await fetch('https://api.maplestory.net/item/1092070')
    // const dataFirstShield = await resFirstShield.json()
    // const resSoulShield = await fetch('https://api.maplestory.net/item/1098000')
    // const dataSoulShield = await resSoulShield.json()

    await Inventory.bulkCreate([
      {
        userId: 1,
        statId: 1,
        itemName: `${dataHpPotion.name}`,
        itemType: true,
        description: `Restores 40 points of health (HP): ${dataHpPotion.description}`,
        healthBoost: true,
        gear: false,
        wep: false
      },
    ], options, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Inventories';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
