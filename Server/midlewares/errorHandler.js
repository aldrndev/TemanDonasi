const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.message === "Email_Or_Password_Not_Found") {
    statusCode = 400;
    message = "Invalid email or password";
  }

  if (err.message === "Your_Point_Not_Enough") {
    statusCode = 400;
    message = "Not enough point";
  }

  if (err.message === "Unauthorized" || err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, login first";
  }

  if (err.message === "Data_Not_Found") {
    statusCode = 404;
    message = "Data not found";
  }
  if (
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeValidationError"
  ) {
    statusCode = 400;
    message = err.errors[0].message;
  }

  res.status(statusCode).json({
    statusCode,
    message,
  });
};

module.exports = errorHandler;
