const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const { User, Profile, Post, Category } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");

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
  await queryInterface.bulkInsert("Users", userData);
  await queryInterface.bulkInsert("Profiles", userProfileData);
  await queryInterface.bulkInsert("Categories", categoryData);
  await queryInterface.bulkInsert("Posts", samplePostData);
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      return Post.destroy({
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
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("GET /pub/post dan /admin/post", () => {
  test("200 success get all posts by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/post")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get a single post by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/post/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("title", "Donasi pakaian untuk panti A");
  });

  test("404 fail get a post with non-existing id by admin", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/post/1000000")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Data not found");
  });

  test("200 success get all posts by user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/post")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get all posts by user without login", async () => {
    const res = await request(app).get("/pub/post");
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("200 success get a single post by user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/post/1")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(body.data).toHaveProperty("title", "Donasi pakaian untuk panti A");
  });

  test("404 fail get a post with non-existing id by user", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/pub/post/1000000")
      .set("access_token", resLogin.body.data.access_token);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Data not found");
  });

  test("401 get data from admin without logging in", async () => {
    const res = await request(app).get("/admin/post");
    const { status } = res;
    expect(status).toBe(401);
  });
});

describe("POST /pub/post", () => {
  test("201 success POST a new campaign", async () => {
    const resLogin = await request(app).post("/pub/login").send({
      email: "agungsetiawano567@mail.com",
      password: "agung",
    });
    expect(resLogin.status).toBe(200);
    const newPost = {
      title: "Donasi tes",
      description: "Lorem ipsum dolor sit amet",
      location: "Indonesia",
      goal: 10,
      progress: 0,
      donatedItem: "Pakaian",
      authorId: 2,
      categoryId: 1,
      expirationDate: "2023-11-18",
      images: ["test link", "number two"],
    };
    const resPost = await request(app)
      .post("/pub/post")
      .field("title", "Donasi tes")
      .field("description", "Donation test")
      .field("location", "Indonesia")
      .field("goal", 10)
      .field("donatedItem", "Pakaian")
      .field("authorId", 2)
      .field("categoryId", 1)
      .field("expirationDate", "2023-11-15")
      .attach("postImg", `${__dirname}/placeholder1.jpg`)
      .attach("postImg", `${__dirname}/placeholder2.jpg`)
      .attach("postImg", `${__dirname}/placeholder3.jpg`)
      // .send(newPost)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(201);
  });

  test("200 success DELETE a campaign", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const id = 2;
    const resPost = await request(app)
      .delete("/admin/post/" + id)
      .set("access_token", resLogin.body.data.access_token);
    expect(resPost.status).toBe(200);
  });
});

describe("Get posts categories", () => {
  test("200 success GET post category", async () => {
    const resLogin = await request(app).post("/admin/login").send({
      email: "margarita0@admin.com",
      password: "123456",
    });
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/admin/category")
      .set("access_token", resLogin.body.data.access_token);
    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });
});
