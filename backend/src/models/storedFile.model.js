/**
 * Shared data model between backend and frontend.
 *
 * @typedef {Object} StoredFile
 * @property {string} id           - S3 object key
 * @property {string} filename     - original filename
 * @property {string} bucket       - S3 bucket name
 * @property {number} size         - size in bytes
 * @property {string|null} contentType
 * @property {string} lastModified - ISO date string
 * @property {string|null} url     - optional pre-signed URL
 */

/**
 * Factory to normalize S3 object + metadata into StoredFile.
 *
 * @param {Object} params
 * @param {string} params.key
 * @param {string} params.bucket
 * @param {number} params.size
 * @param {string|null} params.contentType
 * @param {Date} params.lastModified
 * @param {string|null} params.url
 * @returns {StoredFile}
 */
function createStoredFile({
  key,
  bucket,
  size,
  contentType,
  lastModified,
  url,
}) {
  return {
    id: key,
    filename: key.split("/").pop() || key,
    bucket,
    size,
    contentType,
    lastModified: lastModified.toISOString(),
    url,
  };
}

module.exports = { createStoredFile };
