import AWS from 'aws-sdk';
import csv from 'csv-parser';

const s3 = new AWS.S3();

const importFileParser = async (event) => {
  const records = event?.Records || [];
  try {
    const resultPromises = records.map(async (record) => {
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

      return new Promise((resolve, reject) => {
        const results = [];

        s3Stream
          .pipe(csv())
          .on('data', (data) => {
            console.log('CSV Record:', data);
            results.push(data);
          })
          .on('end', () => {
            console.log('CSV Parsing Completed');
            resolve(results);
          })
          .on('error', (error) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          });
      });
    });

    const allResults = await Promise.all(resultPromises);
    console.log('All Results:', allResults);
    return 'CSV processing started.';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { importFileParser };
