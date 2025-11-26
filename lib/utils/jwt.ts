import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

/* -------------------------------------------------------
   Types
-------------------------------------------------------- */
export interface JwtPayload {
  sub: string; // user ID
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface TokenResult {
  token: string;
  expires: Date;
}

export interface AuthTokens {
  access: TokenResult;
  refresh: TokenResult;
}

/* -------------------------------------------------------
   Generate a JWT with optional expiration
-------------------------------------------------------- */
export function generateToken(
  payload: JwtPayload,
  expiresIn: string = (process.env.JWT_ACCESS_EXPIRATION as string) || '15m'
): string {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

/* -------------------------------------------------------
   Verify JWT Token
-------------------------------------------------------- */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
}

/* -------------------------------------------------------
   Generate Access + Refresh Tokens
-------------------------------------------------------- */
export async function generateAuthTokens(user: { _id: Types.ObjectId }): Promise<AuthTokens> {
  // Access token expires in 15 mins
  const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  const accessToken = generateToken({
    sub: user._id.toString(),
    type: 'access',
  });

  // Refresh token expires in 7 days
  const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const refreshToken = generateToken(
    { sub: user._id.toString(), type: 'refresh' },
    (process.env.JWT_REFRESH_EXPIRATION as string) || '7d'
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
}
