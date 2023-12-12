const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const creatToken = (payload) => {
  return jwt.sign(payload, secret_key);
};
const compareToken = (token) => {
  return jwt.verify(token, secret_key);
};

module.exports = {
  creatToken,
  compareToken,
};
