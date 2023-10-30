import { errorResponse, successResponse } from '../../common';
import AWS from 'aws-sdk';

export interface IParams {
  Bucket: string;
  Key: string;
  Expires: number;
  ContentType: string;
};

const importProductsFile = async (event) => {
  const s3 = new AWS.S3();
  const { name } = event.queryStringParameters;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploaded/${name}`,
    Expires: 60,  // URL expiration time in seconds
    ContentType: 'text/csv'
  };
  try {
    const signedUrl = await s3.getSignedUrl('putObject', params);
    return successResponse(signedUrl);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    const err = new Error('Internal server error');
    return errorResponse(err);
  }
};

export { importProductsFile };
