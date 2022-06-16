const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config({ path: "variables.env" });

exports.authenticateUser = async (req, res, next) => {
  // Error messages of express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  // Search if the user is registered
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ msg: "El usuario no existe" });
    return next();
  }

  // Verify password and authenticate
  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } else {
    res.status(401).json({ msg: "La contraseña es incorrecta" });
    return next();
  }
};

exports.userAuthenticated = (req, res) => {
  res.json({ user: req.user });
};
