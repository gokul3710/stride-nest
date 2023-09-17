import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export function generateUserToken(userId: string): string {
const secret = process.env.JWT_SECRET;

  const payload = {
    userId,
  };
  const options = {
    expiresIn: '30d',
  };
  return jwt.sign(payload, secret, options);
}

export function generateGoogleAuthToken(user: any): string {
const secret = process.env.JWT_SECRET;

  const payload = {
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    email: user.email,
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, secret, options);
}

export function getUserFromGoogleAuthToken(req: any): any {
const secret = process.env.JWT_SECRET;

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new HttpException('Authorization header not found', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new HttpException('Token not found', 401);
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return decoded;
  } catch (error) {
    throw new HttpException('Invalid Token', 401);
  }
}

export function generateAdminToken(): string {
  const payload = {
      admin: true,
      random: Math.floor(Math.random() * 1000)
  };
  const options = {
      expiresIn: '30d'
  };
  return jwt.sign(payload, secret, options);
}
