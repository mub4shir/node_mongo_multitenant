const { getConnection } = require("../../connectionManager");
const userService = require("../../service/user");

const signUp = async (req, res) => {
  try {
    const dbConnection = getConnection();
    console.log("signUp dbConnection", dbConnection.name);
    const user = await userService.createUser(dbConnection, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("signUp error", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const dbConnection = req.dbConnection;
    console.log("entered fetchAll");
    console.log("fetchAll dbConnection", dbConnection.name);
    const users = await userService.getAllUsers(dbConnection);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.log("fetchAll error", err);

    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
const fetchOne = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const user = await userService.getUser(dbConnection, req.params.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
const updateOne = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const user = await userService.updateUser(
      dbConnection,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
const deleteOne = async (req, res) => {
  try {
    const dbConnection = getConnection();
    const user = await userService.deleteUser(dbConnection, req.params.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { signUp, fetchAll, fetchOne, updateOne, deleteOne };
