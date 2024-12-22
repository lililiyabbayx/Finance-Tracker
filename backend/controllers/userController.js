const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { seedCategoriesForUser } = require('../utils/categorySeeder');

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
    
    // Seed default categories for the new user
    await seedCategoriesForUser(newUser._id);

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
const KPI = require("../model/KPI");
// Get User Profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user); // Fetch user data by ID
    const kpis = await KPI.find({ userId: req.user }); // Fetch KPIs for the user

    res.status(200).json({
      user,
      kpis, // Include KPIs in the response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
