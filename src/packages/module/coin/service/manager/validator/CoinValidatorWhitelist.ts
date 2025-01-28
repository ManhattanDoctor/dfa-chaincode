import { ICoinAccount } from '@hlf-core/coin';
import { CoinWhitelistForbiddenError } from '@project/common/hlf';
import { ICoin } from '@project/common/hlf/coin';
import { CoinValidator } from './ICoinValidator';
import { ICoinPermissionWhitelist } from '@project/common/hlf/coin/permission';
import * as _ from 'lodash';

export class CoinValidatorWhitelist<C extends ICoin> implements CoinValidator<C, ICoinPermissionWhitelist> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(permission: ICoinPermissionWhitelist, coin: C, account: ICoinAccount): Promise<void> {
        if (!_.includes(permission.objects, account.ownerUid)) {
            throw new CoinWhitelistForbiddenError(account.ownerUid);
        }
    }
}