"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reward.belongsTo(models.RewardCategory, {
        foreignKey: "rewardCategoryId",
      });
      Reward.hasMany(models.RedeemHistory, { foreignKey: "RewardId" });
    }
  }
  Reward.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required",
          },
          notNull: {
            msg: "Name is required",
          },
        },
      },
      rewardCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Reward Category is required",
          },
          notNull: {
            msg: "Reward Category is required",
          },
        },
      },
      redeemPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Redeem Point is required",
          },
          notNull: {
            msg: "Redeem Point is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Reward",
    }
  );
  return Reward;
};
