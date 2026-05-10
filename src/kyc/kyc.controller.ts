import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dtos/create-kyc.dto';
import { RejectKycDto } from './dtos/reject-kyc.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';
import { createFileUploadInterceptor } from '../common/utils/multer.helper';
import { KycQueryDto } from './dtos/kyc-query.dto';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @UseInterceptors(
    createFileUploadInterceptor(
      [
        { name: 'documentFront', maxCount: 1 },
        { name: 'documentBack', maxCount: 1 },
      ],
      './uploads/kyc',
      allowedMimeTypes,
    ),
  )
  async uploadKyc(
    @Body() body: CreateKycDto,
    @CurrentUser() user: Partial<User>,
    @UploadedFiles()
    files: {
      documentFront: Express.Multer.File[];
      documentBack: Express.Multer.File[];
    },
  ) {
    if (!files?.documentFront?.[0] || !files?.documentBack?.[0]) {
      throw new BadRequestException(
        'Both document front and back are required',
      );
    }
    return this.kycService.createKyc(
      {
        ...body,
        documentFront: files.documentFront[0].path,
        documentBack: files.documentBack[0].path,
      },
      user,
    );
  }

  @Get('/')
  @Roles(Role.ADMIN)
  async getKyc(@Query() query: KycQueryDto) {
    return this.kycService.getKyc(query);
  }

  @Get('/mine')
  async getMyKycs(
    @Query() query: KycQueryDto,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.kycService.getKyc({ ...query, userId: user.id });
  }

  @Post('/:userId/reject')
  @Roles(Role.ADMIN)
  async rejectKyc(@Param('userId') userId: number, @Body() body: RejectKycDto) {
    return this.kycService.rejectKyc(userId, body);
  }

  @Post('/:userId/verify')
  @Roles(Role.ADMIN)
  async verifyKyc(@Param('userId') userId: number) {
    return this.kycService.verifyKyc(userId);
  }
}
