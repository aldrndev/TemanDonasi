'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'UserId' });
      User.hasMany(models.Post, { foreignKey: 'authorId' });
      User.hasMany(models.UserDonation, { foreignKey: 'UserId' });
      User.hasMany(models.RedeemHistory, { foreignKey: 'UserId' });
      User.hasMany(models.Certificate, { foreignKey: 'UserId' });
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'username is required',
          },
          notEmpty: {
            msg: 'username is required',
          },
        },
        unique: {
          msg: 'username has been used',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'email is required',
          },
          notNull: {
            msg: 'email is required',
          },
        },
        unique: {
          msg: 'email has been used',
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'password is required',
          },
          notEmpty: {
            msg: 'password is required',
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'role is required',
          },
          notNull: {
            msg: 'role is required',
          },
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
    },

    {
      sequelize,
      modelName: 'User',
    }
  );
  User.beforeCreate((instance, options) => {
    instance.password = hashPassword(instance.password);
  });
  return User;
};
