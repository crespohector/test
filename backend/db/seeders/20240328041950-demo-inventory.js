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
    const resDrgRg = await fetch('https://api.maplestory.net/item/1232010')
    const dataDrgRg = await resDrgRg.json()
    const resCrim = await fetch('https://api.maplestory.net/item/1232034')
    const dataCrim = await resCrim.json()
    const otherPotion = await fetch('https://api.maplestory.net/item/2000030')
    const dataOtherPotion = await otherPotion.json()
    const resMeiRod = await fetch('https://api.maplestory.net/item/1212077')
    const dataMeiRod = await resMeiRod.json()
    const resAmeRod = await fetch('https://api.maplestory.net/item/1232034')
    const dataAmeRod = await resAmeRod.json()
    const resFirstShield = await fetch('https://api.maplestory.net/item/1092070')
    const dataFirstShield = await resFirstShield.json()
    const resSoulShield = await fetch('https://api.maplestory.net/item/1098000')
    const dataSoulShield = await resSoulShield.json()

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
      {
        userId: 1,
        statId: 2,
        itemName: `Power Muffin's ${dataOtherPotion.name}`,
        description: `Grants a 10% boost in strength (STR)`,
        statBoost: true,
        gear: false,
        wep: false
      },
      {
        userId: 1,
        statId: 3,
        itemName: `'Magic Jello's ${dataOtherPotion.name}`,
        description: 'Grants a 10% boost in magic (MAGIC)',
        statBoost: true,
        gear: false,
        wep: false
      },
      {
        userId: 1,
        statId: 4,
        itemName: 'Plad Armor',
        description: 'Grants a 20% increase in physical defense (PDEF): Shiny rich armor of steel',
        statBoost: true,
        gear: true,
        wep: false,
        equipped: true
      },
      {
        userId: 1,
        statId: 2,
        itemName: 'Dragon`s Fury',
        description: `Grants 20% increase in overall strength (STR): ${dataDrgRg.description}`,
        statBoost: true,
        gear: false,
        wep: true,
        equipped: true
      },
      {
        userId: 2,
        statId: 6,
        itemName: `Lucky Farms: ${dataOtherPotion.name}`,
        description: 'Grants a 10% increase in luck (LUCK)',
        statBoost: true,
        gear: false,
        wep: false
      },
      {
        userId: 2,
        statId: 5,
        itemName: 'Magic Robe',
        description: 'Grants a 20% increase in magic defense (MDEF): A magical silk threaded robe',
        statBoost: true,
        gear: true,
        wep: false
      },
      {
        userId: 2,
        statId: 1,
        itemName: `${dataHpPotion.name}`,
        description: `Restores 40 points of health (HP): ${dataHpPotion.description}`,
        healthBoost: true,
        gear: false,
        wep: false
      },
      {
        userId: 2,
        statId: 3,
        itemName: `${dataAmeRod.name}`,
        description: 'Grants a 20% increase in magic (MAGIC): Exquisite fashionable  gold and diamond embedded rod from the deep of Fairy Kingdoms',
        statBoost: true,
        gear: false,
        wep: true,
        equipped: true
      },
      {
        userId: 2,
        statId: 3,
        itemName: `${dataMeiRod.name}`,
        description: 'Grants a 20% increase in magic (MAGIC): Exquisite stylish embedded platinum rod',
        statBoost: true,
        gear: false,
        wep: true,
        equipped: false
      },
      {
        userId: 3,
        statId: 1,
        itemName: `${dataHpPotion.name}`,
        description: `Restores 40 points of health (HP): ${dataHpPotion.description}`,
        healthBoost: true,
        gear: false,
        wep: false
      },
      {
        userId: 3,
        statId: 4,
        itemName: 'Plad Armor',
        description: 'Grants a 20% increase in physical defense (PDEF): Shiny rich armor of steel',
        statBoost: true,
        gear: true,
        wep: false
      },
      {
        userId: 3,
        statId: 2,
        itemName: `${dataCrim.name}`,
        description: 'Grants a 20% increase in strength (STR): Carved from the cave walls of the Deep',
        statBoost: true,
        gear: false,
        wep: true,
        equipped: true
      },
      {
        userId: 3,
        statId: 4,
        itemName: `${dataSoulShield.name}`,
        description: `Grants a 10% increase in physical defense (PDEF): Pure diamonds that capture the blink of the noon sun`,
        statBoost: true,
        gear: false,
        wep: true,
        equipped: false
      },
      {
        userId: 3,
        statId: 5,
        itemName: `${dataFirstShield.name}`,
        description: `Grants a 10% increase in magical defense (MDEF): Collected by the magic of elves deep within the magic forest`,
        statBoost: true,
        gear: false,
        wep: true,
        equipped: true
      },
      {
        userId: 1,
        statId: 5,
        itemName: `${dataFirstShield.name}`,
        description: `Grants a 10% increase in magical defense (MDEF): Collected by the magic of elves deep within the magic forest`,
        statBoost: true,
        gear: false,
        wep: true,
        equipped: false
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
