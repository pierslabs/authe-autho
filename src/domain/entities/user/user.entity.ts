import { CustomErrors } from '../../errors';

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { _id, id, name, email, emailValidated, password, role, img } =
      object;

    if (!_id && !id)
      throw CustomErrors.badRequest(
        'User object must have an id or _id property'
      );

    if (!name) throw CustomErrors.badRequest('User object must have a name');
    if (!email) throw CustomErrors.badRequest('User object must have an email');
    if (!password)
      throw CustomErrors.badRequest('User object must have a password');
    if (!role) throw CustomErrors.badRequest('User object must have a role');
    if (emailValidated === undefined)
      throw CustomErrors.badRequest('User object must have a emailValidated');

    return new UserEntity(
      id || _id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
