import { MockData, errorResponse, successResponse, ResponseInterface } from '../utility';

export const getProductsList: (event) => Promise<ResponseInterface> = async () => {
  try {
    const products = MockData.GetAllProducts();
    return successResponse(products);
  } catch (err) {
    return errorResponse(err);
  }
};
