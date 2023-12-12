const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const { User, Profile } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const parser = require("../config/cloudinary");

const user1 = {
  email: "user.admin@mail.com",
  username: "UserTest",
  password: "usertest",
  fullName: "user admin test",
  phoneNumber: "08080808080",
  address: "Earth",
};

// const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

const user2 = {
  email: "user.test@mail.com",
  username: "UserTestAsUser",
  password: "usertest",
  role: "User",
  fullName: "user test",
  phoneNumber: "08080808080",
  address: "Earth",
};

const userAdmin = {
  username: "margarita",
  email: "margarita0@admin.com",
  password: "123456",
};

const incompleteUser = {
  email: "user.incomplete@mail.com",
  username: "incompleteUser",
  password: "usertest",
  role: "User",
  fullName: "user test",
  profileImg: "templink",
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
  await queryInterface.bulkInsert("Users", userData);
  await queryInterface.bulkInsert("Profiles", userProfileData);
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
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("User Routes Test", () => {
  describe("POST /admin/register and /pub/register - create new User", () => {
    test("201 Success register - should create new User admin", (done) => {
      request(app)
        .post("/admin/register")
        .field("email", "user.admin@mail.com")
        .field("username", "UserTest")
        .field("password", "usertest")
        .field("fullName", "user test")
        .field("phoneNumber", "08080808080")
        .field("address", "Earth")
        .attach("profileImg", `${__dirname}/pfpplaceholder.jpg`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body.data).toHaveProperty("message");
          return done();
        });
    });

    test("201 Success register - should create new User public", (done) => {
      request(app)
        .post("/pub/register")
        // .attach("profileImg", buffer)
        .field("email", "user.test@mail.com")
        .field("username", "UserTestAsUser")
        .field("password", "usertest")
        .field("fullName", "user test")
        .field("phoneNumber", "08080808080")
        .field("address", "Earth")
        .attach("profileImg", `${__dirname}/pfpplaceholder.jpg`)
        // .send(user2)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body.data).toHaveProperty("message");

          return done();
        });
      // const user2 = {
      //   email: "user.test@mail.com",
      //   username: "UserTestAsUser",
      //   password: "usertest",
      //   role: "User",
      //   fullName: "user test",
      //   phoneNumber: "08080808080",
      //   address: "Earth",
      //   profileImg: Buffer.alloc(1024 * 1024 * 10, "."),
      // };
    });

    test("400 Failed register - should return error if email or username is null", (done) => {
      request(app)
        .post("/admin/register")
        .field("password", "wrongpassword")
        .attach("profileImg", `${__dirname}/pfpplaceholder.jpg`)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          // expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed register - should return error if email is already exists", () => {
      request(app)
        .post("/admin/register")
        .field("email", "user.admin@mail.com")
        .field("username", "UserTest")
        .field("password", "usertest")
        .field("fullName", "user test")
        .field("phoneNumber", "08080808080")
        .field("address", "Earth")
        .attach("profileImg", `${__dirname}/pfpplaceholder.jpg`)
        .end((err, res) => {
          if (err) {
            expect(status).toBe(400);
          }
          // const { body, status } = res;

          // expect(status).toBe(400);
          // expect(body).toHaveProperty("message", "Email must be unique");
          // return done();
        });
    });

    test("200 success DELETE a user", async () => {
      const resLogin = await request(app).post("/admin/login").send({
        email: "margarita0@admin.com",
        password: "123456",
      });
      expect(resLogin.status).toBe(200);
      const id = 3;
      const resDeleteUser = await request(app)
        .delete("/admin/user/" + id)
        .set("access_token", resLogin.body.data.access_token);
      expect(resDeleteUser.status).toBe(200);
    });

    test("404 should fail DELETE a non-existing user", async () => {
      const resLogin = await request(app).post("/admin/login").send({
        email: "margarita0@admin.com",
        password: "123456",
      });
      expect(resLogin.status).toBe(200);
      const id = 300000;
      const resDeleteUser = await request(app)
        .delete("/admin/user/" + id)
        .set("access_token", resLogin.body.data.access_token);
      expect(resDeleteUser.status).toBe(404);
      expect(resDeleteUser.body).toHaveProperty("message", "Data not found");
    });
  });

  describe("GET /admin/user - list all user", () => {
    test("200 Success get user data", async () => {
      const resLogin = await request(app).post("/pub/login").send({
        email: "margarita0@admin.com",
        password: "123456",
      });

      expect(resLogin.status).toBe(200);
      const resList = await request(app)
        .get("/admin/user")
        .set("access_token", resLogin.body.data.access_token);

      expect(resList.status).toBe(200);
      expect(resList.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("200 Success get specific user data", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const resList = await request(app)
      .get("/admin/user/1")
      .set("access_token", resLogin.body.data.access_token);

    expect(resList.status).toBe(200);
    expect(resList.body.data).toHaveProperty("Profile", expect.any(Object));
  });

  test("404 trying to find non-existent user id", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const resList = await request(app)
      .get("/admin/user/1000000000")
      .set("access_token", resLogin.body.data.access_token);
    console.log(resList.body);
    expect(resList.status).toBe(404);
    expect(resList.body).toHaveProperty("message", "Data not found");
  });

  test("401 trying to user id with invalid token", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });

    expect(resLogin.status).toBe(200);

    const resList = await request(app)
      .get("/admin/user/")
      .set("access_token", "randomtoken");

    expect(resList.status).toBe(401);
    expect(resList.body).toHaveProperty(
      "message",
      "Invalid token, login first"
    );
  });
});

describe("User login test", () => {
  test("200 success login", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });

    expect(resLogin.status).toBe(200);
  });

  test("400 admin fail to login with wrong password", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "99999999",
    });

    expect(resLogin.status).toBe(400);
    expect(resLogin.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("400 user fail to login with wrong password", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "99999999",
    });

    expect(resLogin.status).toBe(400);
    expect(resLogin.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("400 admin fail to login with unknown email", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "voidemail@mail.com",
      password: "wrongpass",
    });

    expect(resLogin.status).toBe(400);
    expect(resLogin.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("400 user fail to login with unknown email", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "wrongpass",
    });

    expect(resLogin.status).toBe(400);
    expect(resLogin.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("400 user fail to login in admin section", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });

    expect(resLogin.status).toBe(400);
    expect(resLogin.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

describe("Verification test", () => {
  test("Should fail 500", async () => {
    const res = await request(app).get("/pub/verify/4545456");
    const { body, status } = res;
    expect(status).toBe(500);
    expect(body).toHaveProperty("message", "Internal Server Error");
  });
});
