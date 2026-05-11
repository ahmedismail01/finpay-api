import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';
import { TransactionQueryDto } from './dtos/transaction-query.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('transactions')
@ApiBearerAuth()
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
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getWalletTransactions(
    @Param('walletId') walletId: number,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getWalletTransactions(walletId, query);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getAllTransactions(@Query() query: TransactionQueryDto) {
    return this.transactionService.getAllTransactions(query);
  }

  @Get('by-type/:type')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getTransactionsByType(
    @Param('type') type: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getTransactionsByType(type, query);
  }
}
