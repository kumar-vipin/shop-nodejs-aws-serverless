import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart as ICart, CartUpdate } from '../models';
import { Cart, CartItem, CartStatus, Product } from '../../database/entities';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findByUserId(userId: string): Promise<ICart> {
    return await this.cartRepository.findOne({
      where: { userId: userId, status: CartStatus.OPEN },
      relations: ['items', 'items.product'],
    });
  }

  createByUserId(userId: string) {
    const cart = new Cart();
    cart.userId = userId;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    cart.status = CartStatus.OPEN;
    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string, cartId?: string): Promise<ICart> {
    let userCart;
    if (cartId) {
      userCart = await this.cartRepository.findOne({
        where: { userId: userId, id: cartId }
      });
    } else {
      userCart = await this.cartRepository.findOne({
        where: { userId: userId, status: CartStatus.OPEN },
      });
    }
    console.log('userCart=========', JSON.stringify(userCart));
    const cartItems = await this.cartItemRepository.find({
      where: { cartId: userCart?.id },
      relations: ['product'],
    });
    console.log('cartItems===========', cartItems);
    if (userCart) {
      return {
        ...userCart,
        items: cartItems,
      };
    }
    console.log('create createByUserId===========');
    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: CartUpdate): Promise<ICart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);

    await Promise.all(
      items.map(async item => {
        let cartItem = await this.cartItemRepository.findOne({
          where: { cartId: cartId, productId: item.productId },
        });

        if (cartItem) {
          if (item.count > 0) {
            cartItem.count = item.count;
            await this.cartItemRepository.save(cartItem);
          } else {
            await this.cartItemRepository.remove(cartItem);
          }
        } else {
          const product = await this.productRepository.findOne({
            where: { id: item.productId }
          });
          if (product) {
            cartItem = new CartItem();
            cartItem.cart = { id: cartId } as Cart;
            cartItem.product = product;
            cartItem.count = item.count;

            await this.cartItemRepository.save(cartItem);
          }
        }
      }),
    );

    const updatedItems = await this.cartItemRepository.find({
      where: { cartId: cartId },
      relations: ['product'],
    });

    return { id: cartId, items: updatedItems };
  }

  async removeByUserId(userId): Promise<void> {
    const userCart = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    await this.cartItemRepository.delete({ cart: userCart });
    await this.cartRepository.remove(userCart);
  }

}
