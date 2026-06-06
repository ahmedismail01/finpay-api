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
import { KycListQueryDto, KycQueryDto } from './dtos/kyc-query.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationBaseDto } from '../common/dtos/pagination-base.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

@Controller('kyc')
@ApiBearerAuth()
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateKycDto })
  @UseInterceptors(
    createFileUploadInterceptor(
      [
        { name: 'documentFront', maxCount: 1 },
        { name: 'documentBack', maxCount: 1 },
      ],
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

    const [frontUpload, backUpload] = await Promise.all([
      this.cloudinaryService.uploadFile(files.documentFront[0]),
      this.cloudinaryService.uploadFile(files.documentBack[0]),
    ]);

    const filesUploaded = [frontUpload, backUpload];

    return this.kycService.createKyc(
      {
        ...body,
        documentFront: filesUploaded[0].secure_url,
        documentBack: filesUploaded[1].secure_url,
      },
      user,
    );
  }

  @Get('/')
  @Roles(Role.ADMIN)
  async getKyc(@Query() query: KycListQueryDto) {
    return this.kycService.getKycs(query);
  }

  @Get('/mine')
  async getMyKycs(@CurrentUser() user: User) {
    return this.kycService.getKyc({
      userId: user.id,
    });
  }

  @Post('/:kycId/reject')
  @Roles(Role.ADMIN)
  async rejectKyc(
    @CurrentUser() admin: User,
    @Param('kycId') kycId: string,
    @Body() body: RejectKycDto,
  ) {
    return this.kycService.rejectKyc(kycId, body, admin);
  }

  @Post('/:kycId/verify')
  @Roles(Role.ADMIN)
  async verifyKyc(@Param('kycId') kycId: string) {
    return this.kycService.verifyKyc(kycId);
  }
}
