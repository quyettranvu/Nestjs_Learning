import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GoogleService } from '../../user/services/google.service';

import { AuthGuard } from '@nestjs/passport';

@Controller()
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  //keep this route in case we want to redirect the default route to where we want to login with Google
  @Get()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.googleService.googleLogin(req);
  }
}
