import { DynamoDB, errorResponse, Statuses, successResponse, UUID } from '../../common';
import { getProductsList } from '../../../handler';

const DYNAMODB_TABLE_PRODUCTS = process.env.DYNAMODB_TABLE_PRODUCTS;
const DYNAMODB_TABLE_STOCKS = process.env.DYNAMODB_TABLE_STOCKS;

const createProduct = async (event) => {
  try {
    const { title, description, price } = event.body;
    const uniqueId = UUID.generateUUID();
    const productParams = {
      TableName: DYNAMODB_TABLE_PRODUCTS,
      Item: { id: uniqueId, title, description, price },
    };

    const productResponse = await DynamoDB.put(productParams);

    if (productResponse.status === Statuses.ERROR) {
      return errorResponse(productResponse.body, productResponse.statusCode);
    }

    const stockParams = {
      TableName: DYNAMODB_TABLE_STOCKS,
      Item: { product_id: uniqueId, count: 0 },
    };

    const stocksResponse = await DynamoDB.put(stockParams);

    if (stocksResponse.status === Statuses.ERROR) {
      return errorResponse(stocksResponse.body, stocksResponse.statusCode);
    }

    const productListResponse = await getProductsList();
    return successResponse(productListResponse.body);
  } catch (error) {
    return errorResponse(error, 500);
  }
};

export { createProduct };
