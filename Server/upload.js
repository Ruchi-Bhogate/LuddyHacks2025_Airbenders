import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "audio/") });

router.post("/upload", upload.single("media"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const newFileName = `${req.file.filename}.mp3`;
  const newPath = path.join(__dirname, "audio", newFileName);

  fs.renameSync(req.file.path, newPath);

  return res.json({ message: "File uploaded", filePath: newPath, fileName: newFileName });
});

export default router;