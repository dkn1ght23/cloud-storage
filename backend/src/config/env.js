const dotenv = require("dotenv");
dotenv.config();

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

module.exports = {
  port: process.env.PORT || 4000,
  awsRegion: required("AWS_REGION"),
  awsAccessKeyId: required("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
  s3BucketName: required("S3_BUCKET_NAME"),
  s3SignedUrlExpires: parseInt(process.env.S3_SIGNED_URL_EXPIRES || "3600", 10),
};
