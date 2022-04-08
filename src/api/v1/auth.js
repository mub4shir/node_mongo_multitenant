const { getConnection } = require("../../connectionManager");
const authService = require("../../service/auth");
const crypto = require("crypto");
const ErrorResponse = require("../../utils/errorResponse");
const { JWT_COOKIE_EXPIRE } = require("../../config/env.json");

const registerUser = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const user = await authService.register(dbConnection, req.body);
    sendTokenResponse(user, 200, res);
    // res.status(200).json({ success: true, tenant });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("fetchAll dbConnection", dbConnection.name);
    const user = await authService.login(dbConnection, req.body);
    sendTokenResponse(user, 200, res);
    //res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("fetchAll error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const userLogout = async (req, res) => {
  try {
    // const dbConnection = getConnection();
    // req.dbConnection = dbConnection;
    const user = await authService.logout();
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    // const dbConnection = getConnection();
    const dbConnection = req.dbConnection;
    req.dbConnection = dbConnection;
    const user = await authService.getMe(dbConnection, req.user.id);
    console.log(req.user);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // if (NODE_ENV === "production") {
  //   options.secure = true;
  // }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = { registerUser, userLogin, userLogout, getUser };
