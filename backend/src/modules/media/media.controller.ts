import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MediaService } from './media.service';
import {
  PresignedUploadDto,
  ConfirmUploadDto,
  QueryMediaDto,
} from './dto/media.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Media & Storage')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presigned-upload')
  @ApiOperation({ summary: 'Request a secure presigned PUT URL for direct frontend client upload to Cloudflare R2' })
  @ApiResponse({ status: 201, description: 'Presigned upload URL generated.' })
  @ApiResponse({ status: 400, description: 'Invalid MIME type or file size exceeds limit.' })
  requestPresignedUpload(
    @CurrentUser() user: AuthUser,
    @Body() dto: PresignedUploadDto,
  ) {
    return this.mediaService.requestPresignedUpload(user.tenantId, user.userId || user.id, dto);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm completed upload and activate media record' })
  @ApiResponse({ status: 200, description: 'Upload confirmed and verified.' })
  confirmUpload(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto?: ConfirmUploadDto,
  ) {
    return this.mediaService.confirmUpload(user.tenantId, id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List uploaded media files with search & category filters' })
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryMediaDto) {
    return this.mediaService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media file metadata and signed download authorization' })
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.mediaService.findOne(user.tenantId, id);
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'Generate a short-lived signed GET download URL' })
  getDownloadUrl(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('expires') expires?: number,
  ) {
    return this.mediaService.getDownloadUrl(user.tenantId, id, expires);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media object from Cloudflare R2 and remove database record' })
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.mediaService.remove(user.tenantId, id);
  }
}
