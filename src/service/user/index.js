//const bcrypt = require("bcryptjs");

const getAllUsers = async (tenantDbConnection) => {
  try {
    const User = await tenantDbConnection.model("User");
    const users = await User.find({});
    console.log("getAllUsers users", users);
    return users;
  } catch (error) {
    console.log("getAllUsers error", error);
    throw error;
  }
};

const createUser = async (tenantDbConnection, body) => {
  try {
    const User = await tenantDbConnection.model("User");
    const phoneNumber = body.phoneNumber;
    const password = body.password;
    const email = body.email;
    const name = body.name;

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const userPresent = await User.findOne({
      phoneNumber,
    });
    if (userPresent) {
      throw new Error("User Already Present");
    }
    const newUser = await new User({
      phoneNumber,
      password,
      email,
      name,
    }).save();
    return newUser;
  } catch (error) {
    console.log("createUser error", error);
    throw error;
  }
};
const getUser = async (tenantDbConnection, id) => {
  try {
    const User = await tenantDbConnection.model("User");
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (tenantDbConnection, id, body) => {
  try {
    const User = await tenantDbConnection.model("User");
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return user;
  } catch (error) {
    throw error;
  }
};
const deleteUser = async (tenantDbConnection, id) => {
  try {
    const User = await tenantDbConnection.model("User");
    await User.findByIdAndDelete(id);
    return {};
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
