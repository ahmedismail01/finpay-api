import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @CurrentUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':transactionId')
  async getTransaction(@Param('transactionId') transactionId: number) {
    return this.transactionService.getTransactionById(transactionId);
  }

  @Get('wallet/:walletId')
  async getWalletTransactions(
    @Param('walletId') walletId: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.transactionService.getWalletTransactions(
      walletId,
      limit,
      offset,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllTransactions(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.transactionService.getAllTransactions(limit, offset);
  }

  @Get('by-type/:type')
  @Roles(Role.ADMIN)
  async getTransactionsByType(
    @Param('type') type: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.transactionService.getTransactionsByType(type, limit, offset);
  }
}
