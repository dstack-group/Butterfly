import { CRUQueryProvider } from './CRUQueryProvider';

export interface CRUDQueryProvider extends CRUQueryProvider {
  delete: string;
}
