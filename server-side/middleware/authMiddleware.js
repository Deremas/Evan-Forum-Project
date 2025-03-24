const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
  // console.log(authHeader);
  const token = authHeader.split(" ")[1];
  try {
    const { user_name, user_id } = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(user_id);
    // console.log(user_name);

    req.user = { user_name, user_id };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware;
