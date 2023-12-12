'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Profile.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'fullName is required',
          },
          notNull: {
            msg: 'fullName is required',
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Phone Number is required',
          },
          notNull: {
            msg: 'Phone Number is required',
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Address is required',
          },
          notNull: {
            msg: 'address is required',
          },
        },
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'point is required',
          },
          notNull: {
            msg: 'point is required',
          },
        },
      },
      profileImg: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'UserId is required',
          },
          notEmpty: {
            msg: 'UserId is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  );
  return Profile;
};
