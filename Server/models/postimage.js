"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostImage.belongsTo(models.Post, { foreignKey: "PostId" });
      // define association here
    }
  }
  PostImage.init(
    {
      postImg: DataTypes.STRING,
      PostId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostImage",
    }
  );
  return PostImage;
};
