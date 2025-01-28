import { ICoinAccount } from '@hlf-core/coin';
import { ICoin } from '@project/common/hlf/coin';
import { ICoinPermission } from '@project/common/hlf/coin/permission';

export interface ICoinValidator<C extends ICoin = ICoin, P extends ICoinPermission = ICoinPermission> {
    validate(permission: P, coin: C, account: ICoinAccount, ...params): Promise<void>;
}

export abstract class CoinValidator<C extends ICoin, P extends ICoinPermission> implements ICoinValidator<C, P> {
    public abstract validate(permission: P, coin: C, account: ICoinAccount, amount: string): Promise<void>;
}