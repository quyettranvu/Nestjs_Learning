import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './services/auth.service';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //our token has header: bearer token
      secretOrKey: process.env.SECRETKEY,
    });
  }

  //allow to map to action validateUSer to get infos of user
  async validate({ email }) {
    const user = await this.authService.validateUser(email);

    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
