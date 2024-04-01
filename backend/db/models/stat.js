'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stat.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Stat.hasOne(models.Inventory, {
        foreignKey: 'statId'
      });
    }
  }
  Stat.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    strength: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    magic: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    physicalDefense: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    magicDefense: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    luck: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Stat',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Stat;
};
