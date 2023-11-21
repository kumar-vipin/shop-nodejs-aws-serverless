import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as IUser } from '../models';
import { User } from '../../database/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createOne({ name, password }: IUser): Promise<User> {
    const user = this.userRepository.create({ name, password });
    await this.userRepository.save(user);
    return user;
  }
}
