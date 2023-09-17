import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!user?.admin || user instanceof HttpException) {
      throw new HttpException('Invalid Token', 401);
    }

    return user.admin;
  }
}
