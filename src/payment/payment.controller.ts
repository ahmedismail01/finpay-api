import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';
import { PaymentQueryDto } from './dtos/payment-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @CurrentUser() user: User,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(user, createPaymentDto);
  }

  @Get(':paymentId')
  async getPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.getPaymentById(paymentId);
  }

  @Get('user/my-payments')
  async getMyPayments(
    @CurrentUser() user: User,
    @Query() query: PaymentQueryDto,
  ) {
    return this.paymentService.getUserPayments(
      user.id,
      query.limit,
      query.page,
    );
  }

  @Get('wallet/:walletId')
  async getWalletPayments(
    @Param('walletId') walletId: string,
    @Query() query: PaymentQueryDto,
  ) {
    return this.paymentService.getWalletPayments(walletId, query);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllPayments(@Query() query: PaymentQueryDto) {
    return this.paymentService.getAllPayments(query);
  }
}
