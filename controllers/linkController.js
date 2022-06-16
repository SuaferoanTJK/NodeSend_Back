const Link = require("../models/Link");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { validationResult } = require("express-validator");

exports.newLink = async (req, res, next) => {
  // Error messages of express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  // Create link object
  const { nameBase, name } = req.body;
  const link = new Link();
  link.url = shortid.generate();
  link.name = name;
  link.nameBase = nameBase;

  // If user is authenticated
  if (req.user) {
    const { password, downloads } = req.body;
    if (downloads) link.downloads = downloads;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      link.password = await bcrypt.hash(password, salt);
    }
    link.author = req.user.id;
  }

  // Store link in DB
  try {
    await link.save();
    res.json({ msg: `${link.url}` });
    return next();
  } catch (error) {
    res.json({ error });
  }
};

exports.allLinks = async (req, res, next) => {
  try {
    const links = await Link.find({}).select("url -_id");
    res.json({ links });
  } catch (error) {
    console.log(error);
  }
};

exports.hasPassword = async (req, res, next) => {
  try {
    const { url } = req.params;
    const link = await Link.findOne({ url });
    if (!link) {
      res.status(404).json({ msg: "El enlace no existe" });
    }
    if (link.password) {
      return res.json({ password: true, link: link.url, file: link.name });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.verifyPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;
  try {
    const link = await Link.findOne({ url });
    if (bcrypt.compareSync(password, link.password)) {
      next();
    } else {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.obtainLink = async (req, res, next) => {
  try {
    const { url } = req.params;
    const link = await Link.findOne({ url });
    if (!link) {
      res.status(404).json({ msg: "El enlace no existe" });
      return next();
    }
    res.json({ file: link.name, password: false });
    next();
  } catch (error) {
    console.log(error);
  }
};
