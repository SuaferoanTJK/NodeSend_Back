const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Se debe agregar un correo válido").isEmail(),
    check("password", "La contraseña debe tener mínimo 6 carácteres").isLength({
      min: 6,
    }),
  ],
  userController.newUser
);

module.exports = router;
