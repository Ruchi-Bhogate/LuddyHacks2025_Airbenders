const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "audio/" });

router.post("/upload", upload.single("media"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const filePath = req.file.path;
  const fileName = req.file.filename;

  return res.json({ message: "File uploaded", filePath, fileName });
});

module.exports = router;