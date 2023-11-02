import * as jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {
  static generateToken(payload: any) {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        envs.JWT_SECRET,
        {
          expiresIn: envs.JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) resolve(null);
          resolve(token);
        }
      );
    });
  }

  static validateToken(token: string) {
    try {
      return jwt.verify(token, envs.JWT_SECRET);
    } catch (error) {
      return false;
    }
  }
}
