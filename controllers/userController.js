const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newUser = async (req, res) => {
  // Error messages of express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  // Verify if user is already in DB
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "El usuario ya está registrado" });
  }

  // Create new user
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ msg: "Usuario creado correctamente" });
};
