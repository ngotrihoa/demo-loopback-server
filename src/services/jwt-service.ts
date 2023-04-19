import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '../keys';
import {UserProfile} from './user-service';
import {HttpErrors} from '@loopback/rest';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {securityId} from '@loopback/security';

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error while generating token :userProfile is null');
    }
    let token = '';
    try {
      token = jwt.sign(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
      return token;
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generating token ${err}`);
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(`Error verifying token:'token' is null`);
    }

    let userProfile: UserProfile;
    try {
      const decryptedToken = jwt.verify(token, this.jwtSecret) as JwtPayload;
      userProfile = Object.assign(
        {[securityId]: '', id: '', userName: '', fullName: ''},
        {
          [securityId]: decryptedToken.id,
          id: decryptedToken.id,
          userName: decryptedToken.userName,
          fullName: decryptedToken.fullName,
        },
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error verifying token:${err.message}`);
    }
    return userProfile;
  }
}
