import { DynamoDB, errorResponse, ResponseInterface, Statuses, successResponse } from '../../common';

const DYNAMODB_TABLE_PRODUCTS = process.env.DYNAMODB_TABLE_PRODUCTS;
const DYNAMODB_TABLE_STOCKS = process.env.DYNAMODB_TABLE_STOCKS;

const getProductsById: (event) => Promise<ResponseInterface> = async (event) => {
  try {
    const productId = event?.pathParameters?.productId || '';
    if (!productId) {
      const error = new Error('Product ID missing in path parameters!');
      return errorResponse(error, 400);
    }
    const productParams = {
      TableName: DYNAMODB_TABLE_PRODUCTS,
      Key: {
        id: productId,
      },
    };
    const productResponse = await DynamoDB.get(productParams);
    const stockParams = {
      TableName: DYNAMODB_TABLE_STOCKS,
      Key: {
        product_id: productId,
      },
    };
    const stockResponse = await DynamoDB.get(stockParams);
    if (productResponse.status === Statuses.ERROR) {
      return errorResponse(productResponse.body, productResponse.statusCode);
    }
    if (stockResponse.status === Statuses.ERROR) {
      return errorResponse(stockResponse.body, stockResponse.statusCode);
    }
    const product = productResponse.body;
    const stock = stockResponse.body;
    return successResponse({ ...product, count: stock?.count || 0 });
  } catch (err) {
    return errorResponse(err);
  }
};

export { getProductsById };
