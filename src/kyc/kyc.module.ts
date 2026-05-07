import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kyc } from './entities/kyc.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

@Module({
  controllers: [KycController],
  providers: [KycService],
  exports: [],
  imports: [UserModule,TypeOrmModule.forFeature([Kyc]) , 
  MulterModule.register({
    dest: './uploads/kyc',
  })],
})
export class KycModule {}
