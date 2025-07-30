import { ITokenService } from "@/domain/services/ITokenService";
import * as jwt from 'jsonwebtoken';

export class JwtTokenService implements ITokenService {
    private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables.");
    }

    this.accessSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  async generateAccessToken(payload: { email: string; id: string }): Promise<string> {
    return jwt.sign(payload, this.accessSecret, { expiresIn: '1h' });
  }

  async generateRefreshToken(payload: { email: string; id: string }): Promise<string> {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  async verifyAccessToken(token: string): Promise<{ email: string; id: string }> {
    console.log('Verifying access token:', token[0]);
    return jwt.verify(token, this.accessSecret) as { email: string; id: string };
  }
  async verifyRefreshToken(token: string): Promise<{ email: string; id: string }> {
    console.log('Decoding  refresh token:', token[0]);
    return jwt.verify(token, this.refreshSecret) as { email: string; id: string };
  }
}
