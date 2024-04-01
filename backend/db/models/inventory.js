'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {

    static associate(models) {
      Inventory.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Inventory.belongsTo(models.Stat, {
        foreignKey: 'statId'
      });
    }
  }
  Inventory.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    statId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Stats',
        key: 'id'
      },
    },
    itemType: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    healthBoost: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    statBoost: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    gear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    wep: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    equipped: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 250]
      }
    }
  }, {
    sequelize,
    modelName: 'Inventory',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Inventory;
};
