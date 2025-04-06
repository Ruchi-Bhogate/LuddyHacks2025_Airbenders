const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "audio/" });
const path = require("path");
const fs = require("fs");

router.post("/upload", upload.single("media"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const newFileName = `${req.file.filename}.mp3`;
  const newPath = path.join("audio", newFileName);

  fs.renameSync(req.file.path, newPath);

  return res.json({ message: "File uploaded", filePath: newPath, fileName: newFileName });
});

module.exports = router;