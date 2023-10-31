import AWS from 'aws-sdk';
import awsSdkMock from 'aws-sdk-mock';
import { importFileParser } from '../importFileParser';

describe('Lambda Function Tests', () => {
  beforeAll(() => {
    awsSdkMock.mock('S3', 'getObject', (params, callback) => {
      const data = {
        Body: [{
          id: '9878a151100',
          title: 'The Great Gatsby100',
          description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
          price: '15.99'
        }]
      };
      callback(null, data);
    });
  });

  afterAll(() => {
    awsSdkMock.restore('S3');
  });

  it('should process S3 events and parse CSV data', async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'my-store-app-import-vks',
            },
            object: {
              key: 'data.csv',
            },
          },
        },
      ],
    };

    const result = await importFileParser(event);

    expect(result).toEqual('CSV processing started.');
  });
});
