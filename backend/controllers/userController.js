const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

//user registration
const userController = {
  //register
  register: asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log(req.body);
    if (!username || !email || !password || !role) {
      throw new Error("Please provide all the required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user and save it to the database
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
      role: userCreated.role,
    });
  }),
  //login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide all the required fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    let redirectUrl = "";
    if (user.role === "admin") {
      redirectUrl = "/admin-dashboard";
    } else if (user.role === "business") {
      redirectUrl = "/business-dashboard";
    } else {
      redirectUrl = "/personal-dashboard";
    }
    res.json({
      message: "Login successful",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      redirectUrl,
    });
  }),
  //profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  }),
};

module.exports = {
  register: userController.register,
  login: userController.login,
  profile: userController.profile,
};
