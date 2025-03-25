const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      accessToken,
      refreshToken,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
};


exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      success: true,
      accessToken,
      refreshToken,
      id: user._id,
      name: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};




const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

exports.refreshToken = async (req, res) => {
  const { userId, refreshToken } = req.body;

  if (!userId || !refreshToken) {
    return res.status(400).json({ message: 'User ID and refresh token are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
