import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { Currency } from '../database/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User, Currency])],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
