import { regularExps } from '../../../config';

export class RegisterDto {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterDto?] {
    const { name, email, password } = object;

    if (!name) {
      return ['Missing name', undefined];
    }

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

    return [undefined, new RegisterDto(name, email, password)];
  }
}
