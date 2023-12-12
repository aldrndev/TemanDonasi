const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const {
  User,
  Profile,
  Reward,
  RewardCategory,
  RedeemHistories,
} = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { creatToken } = require("../helpers/jwt");
const user1 = {
  email: "user.admin@mail.com",
  username: "UserTest",
  password: "usertest",
  role: "Admin",
};

const user2 = {
  email: "user.test@mail.com",
  username: "UserTest",
  password: "usertest",
  role: "User",
};

const userAdmin = {
  username: "margarita",
  email: "margarita0@admin.com",
  password: "123456",
};

const rewardTest = {
  name: "Reward 5",
  redeemPoint: 10,
  rewardCategoryId: 2,
  createdAt: "2023-10-08 16:42:16.489",
  updatedAt: "2023-10-08 16:42:16.489",
};

let access_token = "";

beforeAll(async () => {
  const userData = require("../data/User.json");
  userData.forEach((user) => {
    user.password = hashPassword(user.password);
    user.createdAt = user.updatedAt = new Date();
  });
  const userProfileData = require("../data/Profile.json").map((profile) => {
    return {
      ...profile,
    };
  });
  const rewardCategoryData = require("../data/RewardCategory.json");
  rewardCategoryData.forEach((rewardCategory) => {
    rewardCategory.createdAt = rewardCategory.updatedAt = new Date();
  });
  const rewardData = require("../data/Reward.json").map((reward) => {
    return {
      ...reward,
    };
  });
  const reedemData = require("../data/ReedemHistory.json").map((redeem) => {
    return {
      ...redeem,
    };
  });
  await queryInterface.bulkInsert("Users", userData);
  await queryInterface.bulkInsert("Profiles", userProfileData);
  await queryInterface.bulkInsert("RewardCategories", rewardCategoryData);
  await queryInterface.bulkInsert("Rewards", rewardData);
  await queryInterface.bulkInsert("RedeemHistories", reedemData);
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      return Profile.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })

    .then((_) => {
      return Reward.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return RewardCategory.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })

    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("GET /pub/reward dan /admin/reward", () => {
  test("200 success get all rewards by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/reward")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get one rewards by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/reward/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(body).toHaveProperty("data");
  });

  test("404 admin fail to get non-existent reward", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/reward/1999999999")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });

  test("200 success get all rewards by user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/reward")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get one rewards by user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/reward/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(body).toHaveProperty("data");
  });

  test("404 user fail to get non-existent reward", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/reward/1999999999")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });

  test("200 success GET reward category", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/reward-category")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe("POST and DELETE /admin/reward", () => {
  test("201 success post reward", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);

    const res = await request(app)
      .post("/admin/reward")
      .send(rewardTest)
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(201);
    // expect(Array.isArray(body.data)).toBeTruthy();
    // expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("404 should fail post reward due to incomplete data", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);

    const res = await request(app)
      .post("/admin/reward")
      .send({ reedemPoint: 5 })
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Name is required");
  });

  test("200 success DELETE a reward", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const id = 2;
    const resPost = await request(app)
      .delete("/admin/reward/" + id)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(200);
  });

  test("404 should fail DELETE not existing reward", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const id = 2000;
    const resPost = await request(app)
      .delete("/admin/reward/" + id)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(404);
    expect(resPost.body).toHaveProperty("message", "Data not found");
  });
});

describe("GET /admin/redeem", () => {
  test("200 success get all redeem history by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/redeemHistory")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get one redeem history by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/redeemHistory/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(body).toHaveProperty("data");
  });

  test("401 user cant use admin endpoint", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/redeemHistory")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(401);
  });

  test("404 should fail getting not existing reedem history", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/redeemHistory/10000")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });
});

describe("PATCH /profile/:id", () => {
  test("404 should error with wrong user Id", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });
    expect(resLogin.status).toBe(200);
    let access_tokenwrong = creatToken({
      id: 99999,
      username: resLogin.body.data.username,
      role: "User",
    });
    const res = await request(app)
      .patch("/pub/profile/1")
      .set("access_token", access_tokenwrong);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });

  test("201 should be success user redeems a reward", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .patch("/pub/profile/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(201);
  });

  test("404 should fail user redeems a fictive reward", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .patch("/pub/profile/10000")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });

  test("400 should fail user redeems a reward with not enough points", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .patch("/pub/profile/3")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(400);
    expect(body).toHaveProperty("message", "Not enough point");
  });
});
