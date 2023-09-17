import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!user?.userId || user instanceof HttpException) {
      throw new HttpException('Invalid Token', 401);
    }

    return user.userId;
  }
}
