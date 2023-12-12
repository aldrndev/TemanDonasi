const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;

const {
  User,
  Profile,
  Post,
  UserDonation,
  Reward,
  Category,
} = require("../models");
const { hashPassword } = require("../helpers/bcrypt");

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

const userDonationTest = {
  amountDonated: 3,
  verifyProofImg: "http://placekitten.com/400/400",
  createdAt: "2023-10-11 16:42:16.489",
  updatedAt: "2023-10-11 16:42:16.489",
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
  const categoryData = require("../data/Category.json").map((category) => {
    return {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const samplePostData = require("../data/Post.json").map((post) => {
    return {
      ...post,
    };
  });
  const userDonationData = require("../data/UserDonation.json").map(
    (donation) => {
      return {
        ...donation,
      };
    }
  );
  await queryInterface.bulkInsert("Users", userData);
  await queryInterface.bulkInsert("Profiles", userProfileData);
  await queryInterface.bulkInsert("Categories", categoryData);
  await queryInterface.bulkInsert("Posts", samplePostData);
  await queryInterface.bulkInsert("UserDonations", userDonationData);
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      return UserDonation.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return Category.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return Profile.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return Post.destroy({
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

describe("GET /admin/donation dan /admin/donation/:id", () => {
  test("200 success get all donation by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/donation")
      .set("access_token", resLogin.body.data.access_token);

    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get one donation by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/donation/1")
      .set("access_token", resLogin.body.data.access_token);

    const { body, status } = res;
    expect(status).toBe(200);
    expect(body).toHaveProperty("data");
  });

  test("200 success get all donations by logged in user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/donation")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe("POST /pub/donation and verify it by patch", () => {
  test("201 success POST a new donation", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });

    expect(resLogin.status).toBe(200);
    const resPost = await request(app)
      .post("/pub/donation/2")
      .send(userDonationTest)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(201);
    expect(resPost.body).toHaveProperty("message");
  });

  test("404 fail add new donation due to non-existent post", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "santoso887@mail.com",
      password: "aabbccdd",
    });

    expect(resLogin.status).toBe(200);
    const resPost = await request(app)
      .post("/pub/donation/20000")
      .send(userDonationTest)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(404);
    expect(resPost.body).toHaveProperty("message");
  });

  test("200 success PATCH verify a new donations id 2", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const resPatch1 = await request(app)
      .patch("/admin/donation/2")
      .attach("verifyProofImg", `${__dirname}/proofplaceholder.jpg`)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPatch1.status).toBe(201);
  });

  test("404 should be error trying to PATCH non-existing donation", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const id = 20000;
    const resPatch = await request(app)
      .patch("/admin/donation" + id)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPatch.status).toBe(404);
  });
});
