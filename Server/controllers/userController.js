const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { compareToken, creatToken } = require("../helpers/jwt");
const {
  Profile,
  User,
  sequelize,
  Category,
  Post,
  PostImage,
  RedeemHistory,
  RewardCategory,
  Reward,
  Certificate,
  UserDonation,
} = require("../models/index");

const nodemailer = require("nodemailer");

class userController {
  static async register(req, res, next) {
    const { email, username, password, fullName, phoneNumber, address } =
      req.body;

    const t = await sequelize.transaction();
    const profileImg = req.file.path;
    try {
      const newUser = await User.create(
        {
          email,
          username,
          password,
          role: "User",
          isVerified: false,
        },
        { transaction: t }
      );
      const newProfile = await Profile.create(
        {
          fullName,
          phoneNumber,
          address,
          point: 0,
          profileImg,
          UserId: newUser.id,
        },
        { transaction: t }
      );

      const token = newUser.id;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASS_EMAIL,
        },
      });

      const link = `https://teman-donasi.web.app/pub/verify/${token}`;
      await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: newUser.email,
        subject: "Verify your email address",
        html: `<p>Please verify your email address by clicking the following link: <a href="${link}">Here</a></p>`,
      });

      await t.commit();
      res.status(201).json({
        statusCode: 201,
        data: {
          message: `user dengan id ${newUser.username} berhasil dibuat`,
        },
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async verifyUser(req, res, next) {
    const { verificationCode } = req.params;

    try {
      // const verified = compareToken(verificationCode);
      // if (!verified) {
      //   throw new Error("Unauthorized");
      // }
      // const { id, username, role } = verified;
      const foundUser = await User.findByPk(verificationCode);

      if (!foundUser) throw new Error("USER_NOT_FOUND");

      await User.update({ isVerified: true }, { where: { id: foundUser.id } });
      // https://vast-torus-400415.web.app
      // res.redirect(`http://localhost:5173/pub/verify/${verificationCode}`);
      res.status(200).json({
        message: "success update",
      });
    } catch (error) {
      console.log(error);
      let status = 500;
      let message = "Internal Server Error";

      if (error.message === "USER_NOT_FOUND") {
        status = 400;
        message = "User not found";
      }

      res.status(status).json({
        message,
      });
    }
  }
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const foundUser = await User.findOne({
        where: {
          email,
        },
      });
      if (!foundUser) {
        throw new Error("Email_Or_Password_Not_Found");
      }
      if (!comparePassword(password, foundUser.password)) {
        throw new Error("Email_Or_Password_Not_Found");
      }
      if (foundUser.isVerified !== true)
        throw new Error("ACCOUNT_NOT_VERIFIED");

      const access_token = creatToken({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          name: foundUser.username,
          access_token,
          message: `${foundUser.username} login successfully`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchUserById(req, res, next) {
    const { id } = req.params;
    try {
      const dataUser = await User.findByPk(id, {
        include: [
          {
            model: Profile,
          },
        ],
      });
      if (!dataUser) {
        throw new Error("Data_Not_Found");
      }
      res.status(200).json({
        data: dataUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchAllPost(req, res, next) {
    const { search } = req.query;
    try {
      let searchQuery = search;
      if (!searchQuery) {
        searchQuery = "";
      }
      const dataPost = await Post.findAll({
        where: {
          title: { [Op.iLike]: `%${searchQuery}%` },
        },
        include: [
          {
            model: Category,
          },
          {
            model: PostImage,
          },
          {
            model: User,
            include: Profile,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        data: dataPost,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchPostById(req, res, next) {
    const { id } = req.params;
    try {
      const foundPost = await Post.findByPk(id, {
        include: [
          {
            model: Category,
          },
          {
            model: PostImage,
          },
          {
            model: User,
            include: Profile,
          },
        ],
      });
      if (!foundPost) {
        throw new Error("Data_Not_Found");
      }
      res.status(200).json({
        data: foundPost,
      });
    } catch (error) {
      next(error);
    }
  }
  static async addPost(req, res, next) {
    const t = await sequelize.transaction();
    const {
      title,
      description,
      location,
      goal,
      donatedItem,
      categoryId,
      expirationDate,
      // images,
    } = req.body;
    const { userId, username, role } = req.user;

    const uploadedUrls = req.files.map((file) => file.path);
    try {
      const newPost = await Post.create(
        {
          title,
          description,
          location,
          goal,
          progress: 0,
          donatedItem,
          authorId: userId,
          categoryId,
          expirationDate,
        },
        { transaction: t }
      );
      const imageDatas = uploadedUrls.map((url) => ({
        postImg: url,
        PostId: newPost.id,
      }));
      const newImage = await PostImage.bulkCreate(imageDatas, {
        transaction: t,
      });

      await t.commit();
      res.status(201).json({
        statusCode: 201,
        message: `Success to create Post ${newPost.title} `,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async fetchDonationByUserId(req, res, next) {
    const { userId, username, role } = req.user;
    try {
      const foundDonation = await UserDonation.findAll({
        where: {
          UserId: userId,
        },
        include: [
          {
            model: User,
            include: Profile,
          },
          {
            model: Post,
          },
        ],
      });

      res.status(200).json({
        statusCode: 200,
        data: foundDonation,
      });
    } catch (error) {
      next(error);
    }
  }
  static async donationPost(req, res, next) {
    const { amountDonated } = req.body;
    const { PostId } = req.params;
    const { userId, role, username } = req.user;
    try {
      const foundPost = await Post.findByPk(PostId);
      if (!foundPost) {
        throw new Error("Data_Not_Found");
      }

      const newDonation = await UserDonation.create({
        UserId: userId,
        PostId,
        amountDonated,
        isVerified: false,
      });
      res.status(201).json({
        statusCode: 201,
        message: `Success Donation to ${foundPost.title} `,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchAllRewards(req, res, next) {
    try {
      const foundRewards = await Reward.findAll({
        include: RewardCategory,
      });

      res.status(200).json({
        statusCode: 200,
        data: foundRewards,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchRewardById(req, res, next) {
    const { id } = req.params;
    try {
      const foundReward = await Reward.findByPk(id);
      if (!foundReward) {
        throw new Error("Data_Not_Found");
      }
      res.status(200).json({
        statusCode: 200,
        data: foundReward,
      });
    } catch (error) {
      next(error);
    }
  }
  static async takeReward(req, res, next) {
    const { id } = req.params;
    const { userId, username, role } = req.user;
    const t = await sequelize.transaction();
    try {
      const foundProfile = await Profile.findByPk(userId, { transaction: t });
      if (!foundProfile) {
        throw new Error("Data_Not_Found");
      }
      const foundReward = await Reward.findByPk(id, { transaction: t });
      if (!foundReward) {
        throw new Error("Data_Not_Found");
      }
      if (foundProfile.point < foundReward.redeemPoint) {
        throw new Error("Your_Point_Not_Enough");
      }
      const point = foundProfile.point - foundReward.redeemPoint;
      const updateProfilePoint = await Profile.update(
        {
          point: point,
        },
        {
          where: {
            id: userId,
          },
        },
        { transaction: t }
      );
      await RedeemHistory.create({
        UserId: userId,
        RewardId: foundReward.id,
      });
      await t.commit();
      res.status(201).json({
        statusCode: 201,
        message: `Succes to redeem ${foundReward.name}`,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async fetchCertificate(req, res, next) {
    const { code } = req.params;
    try {
      const foundCertificate = await Certificate.findOne({
        where: {
          certificateCode: code,
        },
        include: [
          {
            model: User,
            include: Profile,
          },
          {
            model: UserDonation,
            include: Post,
          },
        ],
      });
      if (!foundCertificate) {
        throw new Error("Data_Not_Found");
      }
      res.status(200).json({
        statusCode: 200,
        data: foundCertificate,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchCategory(req, res, next) {
    try {
      const foundCategory = await Category.findAll();
      res.status(200).json({
        statusCode: 200,
        data: foundCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  // static async fetchRewardCategory(req, res, next) {
  //   try {
  //     const foundCategory = await RewardCategory.findAll();
  //     if (!foundCategory) {
  //       throw new Error('Data_Not_Found');
  //     }
  //     res.status(200).json({
  //       statusCode: 200,
  //       data: foundCategory,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async fetchRewardCategory(req, res, next) {
    try {
      const foundCategory = await RewardCategory.findAll();
      if (!foundCategory) {
        throw new Error("Data_Not_Found");
      }

      const foundReward = await Reward.findAll();

      const newCategory = foundCategory.map((category) => {
        const categoryRewards = foundReward.filter(
          (reward) => reward.rewardCategoryId === category.id
        );

        const newReward = categoryRewards.map((reward) => {
          return {
            name: reward.name,
            rewardCategoryId: reward.rewardCategoryId,
            redeemPoint: reward.redeemPoint,
          };
        });

        return {
          id: category.id,
          name: category.name,
          Reward: newReward,
        };
      });

      res.status(200).json({
        statusCode: 200,
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchRedeemHistoryById(req, res, next) {
    const { userId } = req.user;
    try {
      const foundRedeemHistory = await RedeemHistory.findAll({
        where: {
          UserId: userId,
        },
        include: {
          model: Reward,
        },
      });
      if (!foundRedeemHistory) {
        throw new Error("Data_Not_Found");
      }
      res.status(200).json({
        statusCode: 200,
        data: foundRedeemHistory,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
