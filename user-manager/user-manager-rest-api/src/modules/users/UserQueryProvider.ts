import { CRUDQueryProvider } from '../../common/repository/CRUDQueryProvider';

export interface UserQueryProvider extends CRUDQueryProvider {
  findByEmail: string;
}
