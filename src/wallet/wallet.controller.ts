import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { UpdateWalletDto } from './dtos/update-wallet.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('wallets')
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('my-wallet')
  async getMyWallet(@CurrentUser() user: User) {
    return this.walletService.getWalletByUser(user.id);
  }

  @Get(':walletId')
  @Roles(Role.ADMIN)
  async getWallet(@Param('walletId') walletId: number) {
    return this.walletService.getWalletById(walletId);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllWallets(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.walletService.getAllWallets(limit, offset);
  }

  @Put(':walletId')
  @Roles(Role.ADMIN)
  async updateWallet(
    @Param('walletId') walletId: number,
    @Body() updateWalletDto: UpdateWalletDto,
    @CurrentUser() user: User,
  ) {
    if (updateWalletDto.isActive === false) {
      return this.walletService.suspendWallet(
        walletId,
        user,
        updateWalletDto.reasonOfSuspension || 'Admin suspension',
      );
    }

    if (updateWalletDto.isActive === true) {
      return this.walletService.activateWallet(walletId);
    }
  }

  @Put(':walletId/suspend')
  @Roles(Role.ADMIN)
  async suspendWallet(
    @Param('walletId') walletId: number,
    @Body() body: { reason: string },
    @CurrentUser() user: User,
  ) {
    return this.walletService.suspendWallet(walletId, user, body.reason);
  }

  @Put(':walletId/activate')
  @Roles(Role.ADMIN)
  async activateWallet(@Param('walletId') walletId: number) {
    return this.walletService.activateWallet(walletId);
  }
}
