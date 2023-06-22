import { Injectable, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DatabaseService } from 'src/shared/database/database.service';
import { adminJwtPayload } from 'src/auth/interfaces/jwt-admin.payload';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(private db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() || '',
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: adminJwtPayload) {
    if (!payload.admin) {
      return new HttpException('Invalid Token', 401);
    }
    return payload.admin;
  }
}
