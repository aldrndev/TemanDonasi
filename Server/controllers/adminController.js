const { comparePassword } = require('../helpers/bcrypt');
const generateCertificate = require('../helpers/generateCertificate');
const { creatToken } = require('../helpers/jwt');
const pointDonation = require('../helpers/pointDonation');
const nodemailer = require('nodemailer');
const {
  Profile,
  User,
  sequelize,
  Category,
  Post,
  PostImage,
  RedeemHistory,
  Reward,
  UserDonation,
  Certificate,
  RewardCategory,
} = require('../models/index');

class adminController {
  static async register(req, res, next) {
    const { email, username, password, fullName, phoneNumber, address } =
      req.body;
    const t = await sequelize.transaction();
    const profileImg = req.file.path;
    try {
      const newAdmin = await User.create(
        {
          email,
          username,
          password,
          role: 'Admin',
          isVerified: true,
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
          UserId: newAdmin.id,
        },
        { transaction: t }
      );
      await t.commit();
      res.status(201).json({
        statusCode: 201,
        data: {
          message: `Admin dengan id ${newAdmin.username} berhasil dibuat`,
        },
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const foundAdmin = await User.findOne({
        where: {
          email,
        },
      });
      if (!foundAdmin) {
        throw new Error('Email_Or_Password_Not_Found');
      }

      if (foundAdmin.role != 'Admin') {
        throw new Error('Email_Or_Password_Not_Found');
      }
      if (!comparePassword(password, foundAdmin.password)) {
        throw new Error('Email_Or_Password_Not_Found');
      }
      const access_token = creatToken({
        id: foundAdmin.id,
        username: foundAdmin.username,
        role: foundAdmin.role,
      });
      res.status(200).json({
        statusCode: 200,
        data: {
          name: foundAdmin.username,
          access_token,
          message: `${foundAdmin.username} login successfully`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchAllUser(req, res, next) {
    try {
      const dataUsers = await User.findAll({
        include: Profile,
      });

      res.status(200).json({
        data: dataUsers,
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
        throw new Error('Data_Not_Found');
      }
      res.status(200).json({
        data: dataUser,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchAllPost(req, res, next) {
    try {
      const dataPost = await Post.findAll({
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
            PostImage,
            User,
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
        throw new Error('Data_Not_Found');
      }
      res.status(200).json({
        data: foundPost,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deletePost(req, res, next) {
    const { id } = req.params;
    try {
      const foundPost = await Post.findByPk(id);
      if (!foundPost) {
        throw new Error('Data_Not_Found');
      }
      await Post.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        statusCode: 200,
        message: `Success To Delete Post with Id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchAllDonation(req, res, next) {
    try {
      const dataDonations = await UserDonation.findAll({
        include: [
          {
            model: User,
            include: Profile,
          },
          {
            model: Post,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        statusCode: 200,
        data: dataDonations,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchDonationById(req, res, next) {
    const { id } = req.params;
    try {
      const foundDonation = await UserDonation.findByPk(id, {
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
      if (!foundDonation) {
        throw new Error('Data_Not_Found');
      }
      res.status(200).json({
        statusCode: 200,
        data: foundDonation,
      });
    } catch (error) {
      next(error);
    }
  }
  static async verifiedDonation(req, res, next) {
    const { id } = req.params;
    const t = await sequelize.transaction();
    const verifyProofImg = req.file.path;
    try {
      const foundDonation = await UserDonation.findByPk(id, { transaction: t });
      if (!foundDonation) {
        throw new Error('Data_Not_Found');
      }

      const foundPost = await Post.findByPk(foundDonation.PostId, {
        include: Category,
      });

      if (!foundPost) {
        throw new Error('Data_Not_Found');
      }

      const updateDonation = await UserDonation.update(
        {
          verifyProofImg,
          isVerified: true,
        },
        {
          where: { id },
          transaction: t,
        }
      );
      let postData = foundPost.progress + foundDonation.amountDonated;
      const updatePost = await Post.update(
        {
          progress: postData,
        },
        {
          where: { id: foundDonation.PostId },
          transaction: t,
        }
      );
      let foundUser = await User.findByPk(foundDonation.UserId);
      let foundProfile = await Profile.findByPk(foundDonation.UserId);
      let point =
        foundProfile.point +
        pointDonation(foundPost.Category.name, foundDonation.amountDonated);
      const updatePoint = await Profile.update(
        {
          point,
        },
        {
          where: {
            id,
          },
          transaction: t,
        }
      );

      const codeCertificate = generateCertificate(foundProfile.phoneNumber);

      const newCertificate = await Certificate.create(
        {
          certificateCode: codeCertificate,
          UserId: foundProfile.UserId,
          UserDonatedId: foundDonation.id,
        },
        { transaction: t }
      );

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASS_EMAIL,
        },
      });

      const link = `https://teman-donasi.web.app/certificate/${codeCertificate}`;
      await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: foundUser.email,
        subject: 'Certificate Link',
        html: `<p>Please open your email address by clicking the following link: <a href="${link}">Here</a></p>`,
      });
      await t.commit();
      res.status(201).json({
        statusCode: 201,
        message: 'Success to verified this donation',
      });
    } catch (error) {
      next(error);
      await t.rollback();
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
        throw new Error('Data_Not_Found');
      }
      res.status(200).json({
        statusCode: 200,
        data: foundReward,
      });
    } catch (error) {
      next(error);
    }
  }
  static async addReward(req, res, next) {
    const { name, rewardCategoryId, redeemPoint } = req.body;
    try {
      const newReward = await Reward.create({
        name,
        rewardCategoryId,
        redeemPoint,
      });
      res.status(201).json({
        statusCode: 201,
        data: newReward,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteReward(req, res, next) {
    const { id } = req.params;
    try {
      const foundReward = await Reward.findByPk(id);
      if (!foundReward) {
        throw new Error('Data_Not_Found');
      }
      await Reward.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        statusCode: 200,
        message: `Success to delete rewward with id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchAllRedeemHistory(req, res, next) {
    try {
      const dataRedeemHistories = await RedeemHistory.findAll({
        include: [
          {
            model: User,
            include: Profile,
          },
          Reward,
        ],
      });
      res.status(200).json({
        statusCode: 200,
        data: dataRedeemHistories,
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchRedeemHistoryById(req, res, next) {
    const { id } = req.params;
    try {
      const foundRedeemHistory = await RedeemHistory.findByPk(id);
      if (!foundRedeemHistory) {
        throw new Error('Data_Not_Found');
      }
      res.status(200).json({
        statusCode: 200,
        data: foundRedeemHistory,
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
  static async fetchRewardCategory(req, res, next) {
    try {
      const foundRewardCategory = await RewardCategory.findAll();
      res.status(200).json({
        statusCode: 200,
        data: foundRewardCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const foundUser = await User.findByPk(id);
      if (!foundUser) {
        throw new Error('Data_Not_Found');
      }
      await User.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        statusCode: 200,
        message: `Success to delete user with id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = adminController;
