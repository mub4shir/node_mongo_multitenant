const ErrorResponse = require("../../utils/errorResponse");
const register = async (tenantDbConnection, body) => {
  try {
    const User = await tenantDbConnection.model("User");
    const phoneNumber = body.phoneNumber;
    const password = body.password;
    const email = body.email;
    const name = body.name;

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
    console.log("registerUser error", error);
    throw error;
  }
};

const login = async (tenantDbConnection, body) => {
  const { email, password } = body;
  const User = await tenantDbConnection.model("User");
  // Validate emil & password
  if (!email || !password) {
    throw new ErrorResponse("Please provide an email and password", 400);
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ErrorResponse("Invalid credentials", 401);
  }
  return user;
};

module.exports = { register, login };
