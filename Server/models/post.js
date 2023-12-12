"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.UserDonation, { foreignKey: "PostId" });
      Post.belongsTo(models.User, { foreignKey: "authorId" });
      Post.belongsTo(models.Category, { foreignKey: "categoryId" });
      Post.hasMany(models.PostImage, { foreignKey: "PostId" });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
          notNull: {
            msg: "Title is required",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description is required",
          },
          notNull: {
            msg: "Description is required",
          },
        },
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Location is required",
          },
          notNull: {
            msg: "Location is required",
          },
        },
      },
      goal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "goal is required",
          },
          notNull: {
            msg: "goal is required",
          },
        },
      },
      progress: DataTypes.INTEGER,
      donatedItem: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Donated Item is required",
          },
          notNull: {
            msg: "Donated Item is required",
          },
        },
      },
      authorId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      expirationDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
