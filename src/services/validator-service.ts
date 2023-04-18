import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories/index';

export function validateCredentials(credentials: Credentials) {
  if (!credentials.user_name) {
    throw new HttpErrors.UnprocessableEntity('user name must be requre');
  }
  if (!credentials.password) {
    throw new HttpErrors.UnprocessableEntity('password must be requre');
  }
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8');
  }
}
