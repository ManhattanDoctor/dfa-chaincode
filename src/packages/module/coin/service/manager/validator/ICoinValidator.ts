import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { ICoinPermission } from '@project/common/hlf/coin/permission';

export interface ICoinValidator<C extends ICoin = ICoin, P extends ICoinPermission = ICoinPermission> {
    validate(action: CoinAction, permission: P, coin: C, ...params): Promise<void>;
}

export abstract class CoinValidator<C extends ICoin, P extends ICoinPermission> implements ICoinValidator<C, P> {
    public abstract validate(action: CoinAction, permission: P, coin: C, ...params): Promise<void>;
}