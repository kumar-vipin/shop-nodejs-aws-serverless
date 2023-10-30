import awsSdkMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importFileParser } from '../importFileParser';

describe('Lambda Function Tests', () => {
  let s3SpyCopy;
  let s3SpyGet;
  let s3SpyDelete;

  beforeAll(() => {
    awsSdkMock.setSDKInstance(AWS);
    s3SpyGet = awsSdkMock.mock('S3', 'getObject', jest.fn(() => Promise.resolve('test')));
    s3SpyCopy = awsSdkMock.mock('S3', 'copyObject', jest.fn(() => Promise.resolve('test')));
    s3SpyDelete = awsSdkMock.mock('S3', 'deleteObject', jest.fn(() => Promise.resolve('test')));

    jest.mock('csv-parser', () => {
      return jest.fn().mockImplementation(() => {
        const onDataCallback = jest.fn();
        const onEndCallback = jest.fn();
        const onErrorCallback = jest.fn();

        return {
          on: (event, callback) => {
            if (event === 'data') {
              onDataCallback(callback);
            } else if (event === 'end') {
              onEndCallback(callback);
            } else if (event === 'error') {
              onErrorCallback(callback);
            }
          },
        };
      });
    });
  });

  afterAll(() => {
    awsSdkMock.restore('S3');
  });

  it('should process S3 events and parse CSV data', async () => {
    const event = {
      Records: [{
        s3: {
          bucket: { name: 'my-store-app-import-vks' },
          object: { key: 'uploaded/data.csv' },
        },
      }],
    };
    const result = await importFileParser(event);
    expect(s3SpyGet.replace).toHaveBeenCalledTimes(1);
    expect(s3SpyCopy.replace).toHaveBeenCalledTimes(1);
    expect(s3SpyDelete.replace).toHaveBeenCalledTimes(1);
    expect(result).toEqual('CSV processing started.');
  });
});
