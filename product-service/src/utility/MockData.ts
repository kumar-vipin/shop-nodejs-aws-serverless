import products from './products.json';

export interface IProductInterface {
  id: string,
  title: string,
  description: string,
  price: number,
  logo: string,
  count: number
}

const GetAllProducts = (): IProductInterface[] => products;
const GetProductsById = (productId: string): IProductInterface => products.find(product => product.id === productId);

export const MockData = {
  GetAllProducts,
  GetProductsById
};
