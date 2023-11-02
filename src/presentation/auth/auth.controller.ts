import e, { Request, Response } from 'express';
import { RegisterDto } from '../../domain/dtos';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../domain/dtos/auth/login.dto';

export class AuthController {
  // DI
  constructor(public readonly authService: AuthService) {}

  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);

    await this.authService
      .loginUser(loginDto!)
      .then((result) => {
        res.json({ data: result });
      })
      .catch(() => {
        console.log('error', error);
        res.status(400).json({ error });
      });
  };

  public register = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authService
      .registerUser(registerDto!)
      .then((result) => {
        res.json({ data: result });
      })
      .catch((error) => {
        console.log('error', error);
        res.status(400).json({ error });
      });
  };

  public validateEmail = async (_: Request, res: Response) => {
    res.json({ data: 'validate-email' });
  };
}
