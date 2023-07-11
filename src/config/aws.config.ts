import {S3} from 'aws-sdk';
import { config } from 'dotenv';
config();

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_PASSKEY
const secretAccessKey = process.env.AWS_SECRET

const s3 = new S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

// Example upload function
export async function uploadFileToS3(file: Buffer, fileName: string): Promise<string> {
  const params = {
    Bucket: 'stride-profile',
    Key: fileName,
    Body: file,
  };

  const result = await s3.upload(params).promise();

  return result.Location; // Returns the URL of the uploaded file
}

