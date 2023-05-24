import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { UserRepository } from './repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStategy } from './jwt.strategy';
import { UserController } from './controllers/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleService } from './services/google.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({
      defaultStategy: 'jwt',
      property: 'user',
      session: false,
    }),
    // JwtModule.register({
    //   secret: process.env.SECRETKEY,
    //   signOptions: {
    //     expiresIn: process.env.SECRETKEY,
    //   },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    UserService,
    AuthService,
    GoogleService,
    UserRepository,
    JwtStategy,
  ], //add PostRepository to ensure that it mapped to BaseRepository(since it was injected with model)
})
export class UserModule {}
