import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = getUserFromGoogleAuthToken(request);
    return super.canActivate(context);
  }
}

export function getUserFromGoogleAuthToken(request: any): any {
  const secret = process.env.JWT_SECRET;

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new HttpException('Authorization header not found', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new HttpException('Token not found', 401);
  }

  try {
    const decoded = jwt.verify(token, secret);
    request.user = decoded;
    return decoded;
  } catch (error) {
    throw new HttpException('Invalid Token', 401);
  }
}
