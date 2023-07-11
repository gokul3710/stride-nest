import { Injectable, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { userJwtPayload } from '../auth/interfaces/jwt-user.payload';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() || '',
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: userJwtPayload) {
    if (!payload) {
      return new HttpException('Invalid Token', 401);
    }
    return payload;
  }
}
