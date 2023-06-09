import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export type Credentials = {
  user_name: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(User, dataSource);
  }
}
