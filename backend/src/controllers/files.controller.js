const {
  uploadFileToS3,
  listFilesFromS3,
  deleteFileFromS3,
  streamFileFromS3ToResponse,
} = require("../services/s3.service");

/**
 * GET /files
 * List all files.
 */
async function listFiles(req, res) {
  try {
    const files = await listFilesFromS3();
    res.json({ files });
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).json({ message: "Failed to list files" });
  }
}

/**
 * POST /files
 * Upload a single file (field name: "file").
 */
async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { buffer, originalname, mimetype } = req.file;
    // key can be originalname or prefixed with timestamp to avoid collisions
    const key = `${Date.now()}-${originalname}`;

    const storedFile = await uploadFileToS3(buffer, key, mimetype);
    res.status(201).json({ file: storedFile });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Failed to upload file" });
  }
}

/**
 * DELETE /files/:id
 * Delete a file by its S3 key (id).
 */
async function deleteFile(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing file id" });
    }

    await deleteFileFromS3(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "Failed to delete file" });
  }
}

/**
 * GET /files/:id/download
 * Streams file bytes as an attachment to the client.
 */
async function downloadFile(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing file id" });
    }

    // This will fetch from S3 and pipe to the response.
    await streamFileFromS3ToResponse(id, res);
    // Important: do NOT send any more responses here;
    // streaming handles it.
  } catch (err) {
    console.error("Error streaming file:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to download file" });
    }
  }
}

module.exports = {
  listFiles,
  uploadFile,
  deleteFile,
  downloadFile,
};
