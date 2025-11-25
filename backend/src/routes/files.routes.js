const express = require("express");
const multer = require("multer");
const {
  listFiles,
  uploadFile,
  deleteFile,
  downloadFile,
} = require("../controllers/files.controller");

// Use memory storage so we can send buffers directly to S3.
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// GET /files
router.get("/", listFiles);

// POST /files (single file, field: "file")
router.post("/", upload.single("file"), uploadFile);

// DELETE /files/:id
router.delete("/:id", deleteFile);

// GET /files/:id/download
router.get("/:id/download", downloadFile);

module.exports = router;
