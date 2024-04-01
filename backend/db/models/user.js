'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Checklist, {
        foreignKey: 'userId'
      })
      User.hasOne(models.Inventory, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Stat, {
        foreignKey: 'userId'
      })
      User.hasMany(models.userStat, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 20],
        isAlphanumeric: true,
        isNotEmail(value) {
          Validator.isEmail(value) ? (function
            () {
            throw new Error('Username cannot be an email')
          }()) : ''
        }
      }
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 30],
        // isNumeric: false,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 250],
        isEmail: true
      }

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['email', 'password', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};
