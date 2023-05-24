import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  //get link of private file
  @Get('access')
  async getLinkAccess(@Query('key') key: string) {
    const url = this.mediaService.getLinkMediaKey(key);
    return {
      url: url,
    };
  }

  //Upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    return await this.mediaService.upload(file);
  }

  @Post('uploads')
  @UseInterceptors(FileInterceptor('files'))
  async uploads(@UploadedFile() files) {
    const medias = [];
    for (const item of files) {
      medias.push(await this.mediaService.upload(item));
    }
    return medias;
  }

  @Put('update-acl')
  async updateAcl(@Body('media_id') media_id: string) {
    return await this.mediaService.updateACL(media_id);
  }

  // delet file
  @Delete('delete')
  async delete(@Query('media_id') media_id: string) {
    await this.mediaService.deleteFileS3(media_id);
    return true;
  }
}
