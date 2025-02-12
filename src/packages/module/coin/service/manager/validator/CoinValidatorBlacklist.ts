import { ICoinAccount } from '@hlf-core/coin';
import { CoinBlacklistForbiddenError } from '@project/common/hlf';
import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { CoinValidator } from './ICoinValidator';
import { ICoinPermissionBlacklist } from '@project/common/hlf/coin/permission';
import * as _ from 'lodash';

export class CoinValidatorBlacklist<C extends ICoin> implements CoinValidator<C, ICoinPermissionBlacklist> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static async validate(permission: ICoinPermissionBlacklist, coin: ICoin, account: ICoinAccount): Promise<void> {
        if (_.includes(permission.objects, account.ownerUid)) {
            throw new CoinBlacklistForbiddenError(account.ownerUid);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(action: CoinAction, permission: ICoinPermissionBlacklist, coin: C, account: ICoinAccount): Promise<void> {
        await CoinValidatorBlacklist.validate(permission, coin, account);
    }
}