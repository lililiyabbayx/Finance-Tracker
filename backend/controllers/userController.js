const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Register User
exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    let redirectUrl = "";

    // Decide the redirect URL based on the user role
    if (user.role === "admin") {
      redirectUrl = "/admin-dashboard";
    } else if (user.role === "business") {
      redirectUrl = "/business-dashboard";
    } else {
      redirectUrl = "/personal-dashboard";
    }

    res.json({ token, redirectUrl });
  } catch (error) {
    next(error);
  }
};

// Get User Profile
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
