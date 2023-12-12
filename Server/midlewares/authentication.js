const { compareToken } = require("../helpers/jwt");

function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const verified = compareToken(access_token);

    if (!verified.id) {
      throw new Error("Unauthorized");
    }
    const { id, username, role } = verified;

    req.user = {
      userId: id,
      username,
      role,
    };
    next();
  } catch (error) {
    next(error);
  }
}
function adminAuthentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const verified = compareToken(access_token);
    if (!verified.id) {
      throw new Error("Unauthorized");
    }
    if (verified.role !== "Admin") {
      throw new Error("Unauthorized");
    }
    const { id, username, role } = verified;
    req.user = {
      userId: id,
      username,
      role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authentication, adminAuthentication };
