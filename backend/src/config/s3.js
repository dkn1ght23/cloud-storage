const { S3Client } = require("@aws-sdk/client-s3");
const { awsRegion, awsAccessKeyId, awsSecretAccessKey } = require("./env");

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

module.exports = { s3Client };
