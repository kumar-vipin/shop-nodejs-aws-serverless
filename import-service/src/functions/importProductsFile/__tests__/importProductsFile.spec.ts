import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from '../importProductsFile';

describe.skip('importProductsFile', () => {
  /*beforeAll(() => {
    AWSMock.setSDKInstance(AWS); // Set the SDK instance for aws-sdk-mock
    AWSMock.mock('S3','getSignedUrl', (operation, params) => {
      if (operation === 'putObject') {
        const signedUrl = 'https://example-s3-url.com';
        return Promise.resolve({ signedUrl });
      } else {
        const err = new Error('Mocked S3.getSignedUrl error');
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    });
  });

  afterAll(() => {
    AWSMock.restore('S3'); // Restore the original S3 service
  });*/

  it.skip('should generate a signed URL for uploading a CSV file', async () => {
    /*const event = {
      queryStringParameters: {
        name: 'data.csv',
      },
    };
    process.env.S3_BUCKET_NAME = 'my-store-app-import-vks';
    const response = await importProductsFile(event);
    console.log('response-========================', JSON.stringify(response));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ signedUrl: 'signed-url-for-uploading' }));*/
  });

  /*it('should handle errors and return an error response', async () => {
    const event = {
      queryStringParameters: {
        name: 'data.csv',
      },
    };

    const errorMessage = 'Test error message';
    const error = new Error(errorMessage);

    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(500); // Or the appropriate error status code
    expect(response.body).toContain(errorMessage); // Check if the error message is present in the response body
  });*/
});
