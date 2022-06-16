const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  [
    check("email", "Agregar un correo válido").isEmail(),
    check("password", "Debe ingresar la contraseña").not().isEmpty(),
  ],
  authController.authenticateUser
);

router.get("/", auth, authController.userAuthenticated);

module.exports = router;
