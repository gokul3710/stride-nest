import { JwtPayload } from 'jsonwebtoken';

export interface userJwtPayload extends JwtPayload {
  userId: string;
}
