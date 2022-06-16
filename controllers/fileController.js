const Link = require("../models/Link");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

exports.uploadFile = async (req, res, next) => {
  const multerSettings = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };
  const upload = multer(multerSettings).single("file");

  upload(req, res, async (error) => {
    if (!error) res.json({ file: req.file.filename });
    else {
      res.status(401).json({ msg: "El archivo supera la capacidad máxima" });
      return next();
    }
  });
};

exports.deleteFile = async (req, res, next) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
    console.log("Archivo eliminado");
  } catch (error) {
    console.log("El archivo ya no está vigente");
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const { file } = req.params;
    const link = await Link.findOne({ name: file });
    const fileDownload = __dirname + "/../uploads/" + file;
    res.download(fileDownload);
    // Downloads management
    const { downloads, name } = link;
    if (downloads === 1) {
      req.file = name;
      await Link.findOneAndRemove(link.id);
      next();
    } else {
      link.downloads--;
      await link.save();
    }
  } catch (error) {
    console.log(error);
  }
};
