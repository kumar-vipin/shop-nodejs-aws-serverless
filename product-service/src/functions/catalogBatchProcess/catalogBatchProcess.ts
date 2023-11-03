import { DynamoDB, Statuses, UUID } from '../../common';

const DYNAMODB_TABLE_PRODUCTS = process.env.DYNAMODB_TABLE_PRODUCTS;
const DYNAMODB_TABLE_STOCKS = process.env.DYNAMODB_TABLE_STOCKS;

/*const createParams = (item) => {
  const { id, title, description, price } = item;
  return {
    TransactItems: [
      {
        Put: {
          TableName: DYNAMODB_TABLE_PRODUCTS,
          Item: {
            id: {
              'S': id,
            },
            title: {
              'S': title,
            },
            description: {
              'S': description,
            },
            price: {
              'N': `${price}`,
            },
          },
        },
      },
      {
        Put: {
          TableName: DYNAMODB_TABLE_STOCKS,
          Item: {
            product_id: {
              'S': id,
            },
            count: {
              'N': '0',
            },
          },
        },
      },
    ],
  };
};

const createProductWithTransactWriteItems = async (product) => {
  const uniqueId = UUID.generateUUID();
  const { title, description, price } = product;
  const item = { id: uniqueId, title, description, price };
  const params = createParams(item);
  await DynamoDB.transactWriteItems(params);
};*/

const createProductWithPut = async (product) => {
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
        await createProductWithPut(product);
      } catch (error) {
        console.error('Error processing SQS message:', error);
      }
    };
    /**
     * Note:
     * Here, Earlier i used forEach function with a callback but forEach does not wait
     * for promises to resolve. So instead of forEach, you can just use a for loop and await each
     * function call for each record.
     */
    /** Records.forEach(recordIterativeFn); */

    for (const record of Records) {
      await recordIterativeFn(record);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export { catalogBatchProcess };
