import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kyc } from './entities/kyc.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { WalletModule } from '../wallet/wallet.module';
import { Currency } from '../database/entities/currency.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

@Module({
  controllers: [KycController],
  providers: [KycService],
  exports: [],
  imports: [
    UserModule,
    WalletModule,
    TypeOrmModule.forFeature([Kyc, Currency]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CloudinaryModule,
  ],
})
export class KycModule {}
