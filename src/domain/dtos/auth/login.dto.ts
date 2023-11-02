import { regularExps } from '../../../config';

export class LoginDto {
  constructor(public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, LoginDto?] {
    const { email, password } = object;

    if (!email) {
      return ['Missing email', undefined];
    }

    if (regularExps.email.test(email) === false) {
      return ['Email is not valid', undefined];
    }

    if (!password) {
      return ['Missing password', undefined];
    }

    if (password.length < 6) {
      return ['Password must be at least 6 characters', undefined];
    }

    return [undefined, new LoginDto(email, password)];
  }
}
