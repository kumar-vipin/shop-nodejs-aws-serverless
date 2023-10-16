import { MockData, errorResponse, successResponse, ResponseInterface } from '../utility';

export const getProductsById: (event) => Promise<ResponseInterface> = async (event) => {
  try {
    const productId = event?.pathParameters?.productId || '';
    const product = MockData.GetProductsById(productId);
    if (!product) {
      const error = new Error('Product not found!');
      return errorResponse(error, 404);
    }
    return successResponse(product);
  } catch (err) {
    return errorResponse(err);
  }
};
