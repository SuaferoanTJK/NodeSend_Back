const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  [
    check("name", "No se encontró archivo para subir").not().isEmpty(),
    check("nameBase", "No se encontró archivo para subir").not().isEmpty(),
  ],
  auth,
  linkController.newLink
);

router.get("/", linkController.allLinks);

router.get("/:url", linkController.hasPassword, linkController.obtainLink);

router.post("/:url", linkController.verifyPassword, linkController.obtainLink);

module.exports = router;
