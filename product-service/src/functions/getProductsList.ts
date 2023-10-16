import { DynamoDB, errorResponse, ResponseInterface, Statuses, successResponse } from '../utility';

const DYNAMODB_TABLE_PRODUCTS = process.env.DYNAMODB_TABLE_PRODUCTS;
const DYNAMODB_TABLE_STOCKS = process.env.DYNAMODB_TABLE_STOCKS;

export const getProductsList: () => Promise<ResponseInterface> = async () => {
  try {
    const params = {
      TableName: DYNAMODB_TABLE_PRODUCTS,
    };

    const response = await DynamoDB.scan(params);
    if (response.status === Statuses.ERROR) {
      return errorResponse(response.body, response.statusCode);
    }
    const products = response.body;
    const productsWithStocks = await Promise.all((products || []).map(async product => {
      const stockParams = {
        TableName: DYNAMODB_TABLE_STOCKS,
        Key: {
          product_id: product.id,
        },
      };

      const stockResponse = await DynamoDB.get(stockParams);

      if (stockResponse.status === Statuses.ERROR) {
        return errorResponse(stockResponse.body, response.statusCode);
      }
      const stock = stockResponse.body;
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stock?.count || 0,
      };
    }));
    return successResponse(productsWithStocks);
  } catch (error) {
    throw error;
  }
};
