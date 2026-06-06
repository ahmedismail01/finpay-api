import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dtos/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: RegisterDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
    });
    if (userExists) {
      throw new BadRequestException(
        'User with this email or phone number already exists',
      );
    }
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(query: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({ ...user, ...data });
  }
}
