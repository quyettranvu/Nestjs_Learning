import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  googleLogin(req) {
    if (!req.user) {
      return 'No User from Google Service';
    }

    return {
      message: 'User Info from Google',
      user: req.user,
    };
  }
}
