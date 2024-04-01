'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // a joins table hybrid with seeded columns thus no ref will be involved in the model
    }

    static async setDefWar(userId, level) {
      const warStats = this.heroType === 'Warrior'
      if (!warStats) {
        throw new Error('Default stats for Warrior not found')
      }

      // Calculate default stats for warriors based on level
      const defHP = level === 1 ? 50 : Math.max(Math.round(50 * (level - 1) * 2.5));
      const defSTR = 100 + (level - 1) * 75; // Core stat (STR) increases by 75 per level
      const defPDEF = 100 + (level - 1) * 100;
      // Other stats increase by 50 per level
      const defMagic = 50 + (level - 1) * 50;
      const defLuck = 50 + (level - 1) * 50;
      const defMDef = 50 + (level - 1) * 50;
      //update those stats
      await userStat.upsert({
        userId,
        health: defHP,
        strength: defSTR,
        physicalDefense: defPDEF,
        magic: defMagic,
        magicDefense: defMDef,
        luck: defLuck,
        heroClass: 'Warrior'
      });
    }

    static async setDefMage(userId, level) {
      const mageStats = this.heroType === 'Mage'
      if (!mageStats) {
        throw new Error('Default stats for Mage not found')
      }

      // Calculate default stats for mages based on level
      const defHP = level === 1 ? 50 : Math.max(Math.round(50 * (level - 1) * 2.5));
      const defSTR = 50 + (level - 1) * 50;
      const defPDEF = 50 + (level - 1) * 50;
      const defMagic = 100 + (level - 1) * 100;
      const defLuck = 50 + (level - 1) * 50;
      const defMDef = 100 + (level - 1) * 75;
      //update those stats
      await userStat.upsert({
        userId,
        health: defHP,
        strength: defSTR,
        physicalDefense: defPDEF,
        magic: defMagic,
        magicDefense: defMDef,
        luck: defLuck,
        heroClass: 'Mage'
      });
    }
    async calcHpAndExp(completed) {
      const currLevel = this.getLevel();
      let expGain;

      //increase gained exp points per task per level
      if (completed) {
        expGain = Math.max(10, 50 - (currLevel - 1) * 5);
        /* 1: 50 exp, 2: 45 exp, 3: 40 exp, 4: 35 exp, 5: 30 exp
        */
        this.experience += expGain;
      } else {
        const healthLoss = Math.ceil(12 * (currLevel * 0.75))
        this.health -= healthLoss;
      }
      // If health drops below 0, reset to default hp based on level
      if (this.health <= 0) {
        this.health = this.calcDefaultHealth(currLevel); // Reset hp to default based on level
        // Reset exp to default based on level
        this.experience = this.calcDefaultExperience(currLevel);
      }
      return expGain;
    }

    // Method to calculate default hp based on level
    calcDefaultHealth(level) {
      return level === 1 ? 50 : Math.max(Math.round(50 * (level - 1) * 2.5));
    }
    calcDefaultExperience(level) {
      return level === 1 ? 100 : Math.max(Math.round(((level - 1) * 25) * ((level - 1) * 1.25)), 0); // 2 = 125, 3 = 187, 5 = 500
    }

    // Method to calculate level dynamically based on amt of exp points
    getLevel() {
      // Calculate level based on total experience
      let level = 1;
      let totalExp = this.experience;
      while (totalExp >= Math.round(Math.max(((level - 1) * 25)) * ((level - 1) * 1.25)) && level < 5) {
        level++;

        totalExp -= Math.round(Math.max(((level - 1) * 25) * ((level - 1) * 1.25)))
      }
      return level;
    }
  }
  userStat.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    health: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 50 // default health amt starting at level 1
    },
    experience: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0 // default experience value, but code ensures it starts at 100
    },
    heroClass: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'userStat',
  });

  return userStat;
};
