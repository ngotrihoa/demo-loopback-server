import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {BcryptHasher} from './hash.password';
import {Principal, securityId} from '@loopback/security';

export interface UserProfile extends Principal {
  userName: string;
  fullName: string;
}

export interface UserService<U, C> {
  verifyCredentials(credentials: C): Promise<U>;
  convertToUserProfile(user: U): UserProfile;
}

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    if (!credentials.user_name) {
      throw new HttpErrors.BadRequest('user_name must be require');
    }

    if (!credentials.password) {
      throw new HttpErrors.BadRequest('password must be require');
    }

    const founedUser = await this.userRepository.findOne({
      where: {
        user_name: credentials.user_name,
      },
    });

    if (!founedUser) {
      throw new HttpErrors.NotFound('user not found');
    }

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      founedUser.password,
    );

    if (!passwordMatched) throw new HttpErrors.Unauthorized('password is not correct');

    return founedUser;
  }

  convertToUserProfile(user: User): UserProfile {
    let userName = '';
    if (user.first_name) userName = user.first_name;
    if (user.last_name) {
      userName = user.first_name ? `${user.first_name} ${user.last_name}` : user.last_name;
    }

    return {
      [securityId]: user.id!.toString(),
      id: user.id,
      fullName: userName,
      userName: user.user_name,
    };
  }
}
