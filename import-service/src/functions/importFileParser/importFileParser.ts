import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

const importFileParser = async (event) => {
  const records = event?.Records || [];
  try {
    const csvRowsData = [];
    for (const record of records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;
      const params = { Bucket: bucketName, Key: objectKey };
      const s3Stream = await s3.getObject(params).createReadStream();

      const newObjectKey = objectKey.replace('uploaded', 'parsed');
      await s3.copyObject({
        Bucket: bucketName, CopySource: bucketName + '/' + objectKey, Key: newObjectKey,
      }).promise();

      console.log('File copied to ', "/parsed");

      await s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();

      console.log('Old file deleted', objectKey);


      await s3Stream
        .pipe(csv())
        .on('data', (data) => {
          csvRowsData.push(data);
        })
        .on('end', () => {
          console.log('CSV Parsing Completed');
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
        });
    }
    const queueUrlData = await sqs.getQueueUrl({QueueName: process.env.SQS_QUEUE_NAME}).promise();
    for(const rowData of csvRowsData) {
      const params: SendMessageRequest = {
        MessageBody: JSON.stringify(rowData),
        QueueUrl: queueUrlData.QueueUrl,
      };
      await sqs.sendMessage(params).promise();
    }
    return 'CSV processing started.';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { importFileParser };
