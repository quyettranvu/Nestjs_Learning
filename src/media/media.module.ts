import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSchema } from './models/media.model';
import { ConfigModule } from '@nestjs/config';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repository/media.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Media',
        schema: MediaSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
})
export class MediaModule {}
