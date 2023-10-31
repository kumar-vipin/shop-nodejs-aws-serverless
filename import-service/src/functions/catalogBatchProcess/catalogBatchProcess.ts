import { DynamoDB, Statuses, UUID } from '../../common';

const DYNAMODB_TABLE_PRODUCTS = process.env.DYNAMODB_TABLE_PRODUCTS;
const DYNAMODB_TABLE_STOCKS = process.env.DYNAMODB_TABLE_STOCKS;

const createProduct = async (product) => {
  const uniqueId = UUID.generateUUID();
  const { title, description, price } = product;
  const productParams = {
    Item: { id: uniqueId, title, description, price },
    TableName: DYNAMODB_TABLE_PRODUCTS,
  };
  const productResponse = await DynamoDB.put(productParams);
  if (productResponse.status === Statuses.ERROR) {
    throw new Error(productResponse.body);
  }

  const stockParams = {
    TableName: DYNAMODB_TABLE_STOCKS,
    Item: { product_id: uniqueId, count: 0 },
  };

  const stocksResponse = await DynamoDB.put(stockParams);

  if (stocksResponse.status === Statuses.ERROR) {
    throw new Error(stocksResponse.body);
  }
};

const catalogBatchProcess = async (event) => {
  const { Records = [] } = event;

  try {
    const recordIterativeFn = async (record) => {
      try {
        const product = JSON.parse(record.body);
        await createProduct(product);
      } catch (error) {
        console.error('Error processing SQS message:', error);
      }
    };
    Records.forEach(recordIterativeFn);
  } catch (error) {
    console.error('Error:', error);
  }
};

export { catalogBatchProcess };


