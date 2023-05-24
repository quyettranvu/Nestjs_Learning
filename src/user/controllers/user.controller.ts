import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { PassportModule } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt')) // a decorator applied middleware to ensure that the user making the request is authenticated before allowing them to access the protected resource.(URL endpoints below)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
