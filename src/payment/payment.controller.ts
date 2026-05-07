import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('payments')
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
  async getPayment(@Param('paymentId') paymentId: number) {
    return this.paymentService.getPaymentById(paymentId);
  }

  @Get('user/my-payments')
  async getMyPayments(
    @CurrentUser() user: User,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.paymentService.getUserPayments(user.id, limit, offset);
  }

  @Get('wallet/:walletId')
  async getWalletPayments(
    @Param('walletId') walletId: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.paymentService.getWalletPayments(walletId, limit, offset);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllPayments(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.paymentService.getAllPayments(limit, offset);
  }

  @Put(':paymentId/status')
  @Roles(Role.ADMIN)
  async updatePaymentStatus(
    @Param('paymentId') paymentId: number,
    @Body() body: { status: string; log?: any },
  ) {
    return this.paymentService.updatePaymentStatus(
      paymentId,
      body.status,
      body.log,
    );
  }

  @Post(':paymentId/refund')
  async refundPayment(
    @Param('paymentId') paymentId: number,
    @CurrentUser() user: User,
  ) {
    return this.paymentService.refundPayment(paymentId);
  }
}
