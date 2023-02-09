import { ApplicationState } from './application/types';
import { ListState } from './list/types';
import { MulticallState } from './multicall/types';
import { TokenState } from './token/types';
import { TransactionState } from './transaction/types';
import { UserState } from './user/types';

export interface RootState {
  application: ApplicationState;
  list: ListState;
  multicall: MulticallState;
  token: TokenState;
  transaction: TransactionState;
  user: UserState;
}
