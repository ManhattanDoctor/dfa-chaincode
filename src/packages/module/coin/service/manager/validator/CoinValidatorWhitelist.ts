import { ICoinAccount } from '@hlf-core/coin';
import { CoinWhitelistForbiddenError } from '@project/common/hlf';
import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { CoinValidator } from './ICoinValidator';
import { ICoinPermissionWhitelist } from '@project/common/hlf/coin/permission';
import * as _ from 'lodash';

export class CoinValidatorWhitelist<C extends ICoin> implements CoinValidator<C, ICoinPermissionWhitelist> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static async validate(permission: ICoinPermissionWhitelist, coin: ICoin, account: ICoinAccount): Promise<void> {
        if (!_.includes(permission.objects, account.ownerUid)) {
            throw new CoinWhitelistForbiddenError(account.ownerUid);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(action: CoinAction, permission: ICoinPermissionWhitelist, coin: C, account: ICoinAccount): Promise<void> {
        await CoinValidatorWhitelist.validate(permission, coin, account);
    }
}