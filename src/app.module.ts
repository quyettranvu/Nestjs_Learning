import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nest-modules/mailer/dist';
import { GoogleStrategy } from './google/google.strategy';
import { EventGateway } from './event.gateway';

@Module({
  imports: [
    PostModule, //connect to post module
    ConfigModule.forRoot(), //allow config of Nextjs
    //Connect to MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule], //for access to env file
      useFactory: async (configService: ConfigService) => ({
        // transport: configService.get('MAIL_TRANSPORT'),
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(), //hbs HTML view template
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService], //for access to env file
    }),
    UserModule,
    MediaModule,
    SubscriberModule, //connect to subscriber microservices
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleStrategy,
    EventGateway,
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionLoggerFilter,
    // },
  ],
})
export class AppModule {}
