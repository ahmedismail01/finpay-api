import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.userService.findOne({ id: user.id });
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }
}
