"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RedeemHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RedeemHistory.belongsTo(models.User, { foreignKey: "UserId" });
      RedeemHistory.belongsTo(models.Reward, { foreignKey: "RewardId" });
      // define association here
    }
  }
  RedeemHistory.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "UserId is required",
          },
          notNull: {
            msg: "UserId is required",
          },
        },
      },
      RewardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "RewardId is required",
          },
          notNull: {
            msg: "RewardId is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "RedeemHistory",
    }
  );
  return RedeemHistory;
};
