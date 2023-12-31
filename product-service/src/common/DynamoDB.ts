import AWS from 'aws-sdk';

export enum Statuses {
  SUCCESS,
  ERROR
}

interface IResponseInterface {
  statusCode: number;
  status: Statuses;
  body: any;
}

const DynamoDB = {

  response(data: any, status: Statuses = Statuses.SUCCESS, statusCode: number = 200): IResponseInterface {
    return {
      statusCode, status, body: data,
    };
  },

  async transactWriteItems(params): Promise<IResponseInterface> {
    try {
      const dynamoDb = new AWS.DynamoDB();
      await dynamoDb.transactWriteItems(params).promise();
      return this.response('Product created successfully');
    } catch (error) {
      return this.response(error, Statuses.ERROR, 500);
    }
  },

  async put(params): Promise<IResponseInterface> {
    try {
      const documentClient = new AWS.DynamoDB.DocumentClient();
      await documentClient.put(params).promise();
      return this.response('Product created successfully');
    } catch (error) {
      return this.response(error, Statuses.ERROR, 500);
    }
  },

  async get(params): Promise<IResponseInterface> {
    try {
      const documentClient = new AWS.DynamoDB.DocumentClient();
      const data = await documentClient.get(params).promise();
      return this.response(data.Item);
    } catch (error) {
      return this.response(error, Statuses.ERROR, 500);
    }
  },

  async scan(params): Promise<IResponseInterface> {
    try {
      const documentClient = new AWS.DynamoDB.DocumentClient();
      const data = await documentClient.scan(params).promise();
      return this.response(data.Items);
    } catch (error) {
      return this.response(error, Statuses.ERROR, 500);
    }
  },
};

export { DynamoDB };
