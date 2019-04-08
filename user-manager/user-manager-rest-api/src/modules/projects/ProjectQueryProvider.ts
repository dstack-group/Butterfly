import { CRUDQueryProvider } from '../../common/repository/CRUDQueryProvider';

export interface ProjectQueryProvider extends CRUDQueryProvider {
  removeServiceURL: string;
}
