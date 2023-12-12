"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDonation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDonation.belongsTo(models.Post, { foreignKey: "PostId" });
      UserDonation.belongsTo(models.User, { foreignKey: "UserId" });
      UserDonation.hasOne(models.Certificate, {
        foreignKey: "UserDonatedId",
      });
    }
  }
  UserDonation.init(
    {
      UserId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER,
      amountDonated: DataTypes.INTEGER,
      isVerified: DataTypes.BOOLEAN,
      verifyProofImg: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserDonation",
    }
  );
  return UserDonation;
};
