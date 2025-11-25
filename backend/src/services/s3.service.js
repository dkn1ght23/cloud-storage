const {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../config/s3");
const { s3BucketName, s3SignedUrlExpires } = require("../config/env");
const { createStoredFile } = require("../models/storedFile.model");

/**
 * Upload a file buffer to S3.
 *
 * @param {Buffer} buffer
 * @param {string} key
 * @param {string|null} contentType
 * @returns {Promise<import("../models/storedFile.model").StoredFile>}
 */
async function uploadFileToS3(buffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType || undefined,
  });

  await s3Client.send(command);

  // Fetch metadata (HeadObject) to normalize
  const head = await s3Client.send(
    new HeadObjectCommand({
      Bucket: s3BucketName,
      Key: key,
    })
  );

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: s3BucketName,
      Key: key,
    }),
    { expiresIn: s3SignedUrlExpires }
  );

  return createStoredFile({
    key,
    bucket: s3BucketName,
    size: head.ContentLength || 0,
    contentType: head.ContentType || null,
    lastModified: head.LastModified || new Date(),
    url,
  });
}

/**
 * List files in S3 and return StoredFile[].
 *
 * @returns {Promise<import("../models/storedFile.model").StoredFile[]>}
 */
async function listFilesFromS3() {
  const command = new ListObjectsV2Command({
    Bucket: s3BucketName,
  });

  const response = await s3Client.send(command);
  const contents = response.Contents || [];

  const files = await Promise.all(
    contents.map(async (obj) => {
      const key = obj.Key;

      const head = await s3Client.send(
        new HeadObjectCommand({
          Bucket: s3BucketName,
          Key: key,
        })
      );

      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: s3BucketName,
          Key: key,
        }),
        { expiresIn: s3SignedUrlExpires }
      );

      return createStoredFile({
        key,
        bucket: s3BucketName,
        size: obj.Size || 0,
        contentType: head.ContentType || null,
        lastModified: obj.LastModified || new Date(),
        url,
      });
    })
  );

  return files;
}

/**
 * Delete a file from S3 by key.
 *
 * @param {string} key
 */
async function deleteFileFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: s3BucketName,
    Key: key,
  });
  await s3Client.send(command);
}

/**
 * Get a pre-signed URL for downloading a file (still useful for "Show" button).
 *
 * @param {string} key
 * @returns {Promise<string>}
 */
async function getDownloadUrlForS3File(key) {
  const command = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: s3SignedUrlExpires,
  });

  return url;
}

/**
 * Stream a file from S3 directly to an Express response as an attachment.
 *
 * @param {string} key
 * @param {import("express").Response} res
 */
async function streamFileFromS3ToResponse(key, res) {
  const command = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: key,
  });

  const data = await s3Client.send(command);

  const contentType = data.ContentType || "application/octet-stream";
  const filename = key.split("/").pop() || key;

  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );

  // Body is a stream – pipe it to the response
  if (data.Body && typeof data.Body.pipe === "function") {
    data.Body.pipe(res);
  } else {
    // Fallback: if body is not a stream (edge cases)
    let chunks = [];
    for await (const chunk of data.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    res.send(buffer);
  }
}

module.exports = {
  uploadFileToS3,
  listFilesFromS3,
  deleteFileFromS3,
  getDownloadUrlForS3File,
  streamFileFromS3ToResponse,
};
