const path = require('path')
const deploy = require('s3-deployment-proc');

const directoryPath = path.resolve(__dirname, `./${process.env.DIST_DIR_NAME || '.output'}`);
const awsBucketName = process.env.AWS_BUCKET_NAME || 'templates-staging.easygenerator.com';
const awsRegion = process.env.AWS_REGION || 'us-east-1';

deploy(directoryPath, 'simple', awsBucketName, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, awsRegion);