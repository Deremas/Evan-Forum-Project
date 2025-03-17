const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  //   res.send("register");
  const { user_name, first_name, last_name, email, password } = req.body;
  if (!user_name || !first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required informaton" });
  }

  try {
    const registerData =
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES(?,?,?,?,?)";
    const checkData =
      "SELECT user_name, user_id FROM userTable where user_name = ? or email = ?";

    const [user] = await dbConnection.query(checkData, [user_name, email]);
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already existed" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(registerData, [
      user_name,
      first_name,
      last_name,
      email,
      hashedPassword,
    ]);
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User account created" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later!" });
  }
};

const login = async (req, res) => {
  //   res.send("login");
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }

  try {
    const loginData =
      "SELECT user_name, user_id, password FROM userTable where email = ?";

    const [user] = await dbConnection.query(loginData, [email]);
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }
    //  compare password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }
    return res.json({ user: user[0].password });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later!" });
  }
};

const checkUser = async (req, res) => {
  res.send("check user");
};

module.exports = { register, login, checkUser };
