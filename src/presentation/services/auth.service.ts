import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data/mongo';
import { CustomErrors } from '../../domain';
import { RegisterDto } from '../../domain/dtos';
import { LoginDto } from '../../domain/dtos/auth/login.dto';
import { UserEntity } from '../../domain/entities/user/user.entity';
import { EmailService } from './email.service';

export class AuthService {
  //DI
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerDto: RegisterDto) {
    const existingUser = await UserModel.findOne({ email: registerDto.email });

    if (existingUser) throw CustomErrors.badRequest('Email already exists');

    try {
      const user = new UserModel(registerDto);
      console.log('user', user);
      user.password = bcryptAdapter.hash(user.password);
      await user.save();
      return await this.sendEmailValidation(user.email);
    } catch (error) {
      CustomErrors.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginDto: LoginDto) {
    const existingUser = await UserModel.findOne({ email: loginDto.email });

    if (!existingUser)
      throw CustomErrors.badRequest('Email or password incorrect');

    const isPasswordCorrect = bcryptAdapter.compare(
      loginDto.password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      throw CustomErrors.badRequest('Email or password incorrect');

    const { password, ...userEntity } = UserEntity.fromObject(existingUser);
    console.log('userEntity', userEntity);
    const payload = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = await JwtAdapter.generateToken(payload);
    if (!token)
      throw CustomErrors.internalServerError('Error generating token');

    return {
      user: userEntity,
      token: token,
    };
  }

  private async sendEmailValidation(email: string) {
    const token = await JwtAdapter.generateToken({ email });

    if (!token)
      throw CustomErrors.internalServerError('Error generating token');

    const link = `${process.env.WEB_SERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Click on the link below to validate your email</h1>
      <a href="${link}">Validate email</a>
    `;
    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };
    const sentEmailConfirmation = await this.emailService.sendEmail(options);

    if (!sentEmailConfirmation)
      throw CustomErrors.internalServerError('Error sending email');
    return true;
  }
}
