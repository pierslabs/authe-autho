import { Request, Response } from 'express';
import { RegisterDto } from '../../domain/dtos';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../domain/dtos/auth/login.dto';

export class AuthController {
  // DI
  constructor(public readonly authService: AuthService) {}

  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);

    if (error) {
      res.status(400).json(error);
      return;
    }

    await this.authService
      .loginUser(loginDto!)
      .then((result) => {
        res.json({ data: result });
      })
      .catch((error) => {
        this.handleErrors(error, res);
      });
  };

  public register = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);

    if (error) {
      res.status(400).json(error);
      return;
    }

    this.authService
      .registerUser(registerDto!)
      .then((result) => {
        res.json({ data: result });
      })
      .catch((error) => {
        this.handleErrors(error, res);
      });
  };

  public validateEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService
      .validateEmail(token)
      .then((result) => {
        res.json({ data: 'email validate ✅' });
      })
      .catch((error) => {
        this.handleErrors(error, res);
      });
  };

  private handleErrors(error: any, res: Response) {
    res.status(400).json({ error: error.message });
  }
}
