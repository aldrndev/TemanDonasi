"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Certificate.belongsTo(models.User, { foreignKey: "UserId" });
      Certificate.belongsTo(models.UserDonation, {
        foreignKey: "UserDonatedId",
      });
      // define association here
    }
  }
  Certificate.init(
    {
      certificateCode: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      UserDonatedId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Certificate",
    }
  );
  return Certificate;
};
