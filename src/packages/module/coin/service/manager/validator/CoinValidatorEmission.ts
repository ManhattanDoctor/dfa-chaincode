import { MathUtil } from '@ts-core/common';
import { ICoinAccount } from '@hlf-core/coin';
import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { ICoinPermissionEmission } from '@project/common/hlf/coin/permission';
import { CoinValidator } from './ICoinValidator';
import { CoinEmissionMaximumInvalidError } from '@project/common/hlf';
import * as _ from 'lodash';

export class CoinValidatorEmission<C extends ICoin> extends CoinValidator<C, ICoinPermissionEmission> {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static async validate(permission: ICoinPermissionEmission, coin: ICoin, amount: string): Promise<void> {
        await CoinValidatorEmission.check(coin, permission, amount);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private static async check(coin: ICoin, permission: ICoinPermissionEmission, amount: string): Promise<void> {
        let { maximum } = permission;
        if (!_.isNil(maximum)) {
            await CoinValidatorEmission.maximumCheck(coin, maximum, amount);
        }
    }

    private static async maximumCheck(coin: ICoin, maximum: string, amount: string): Promise<void> {
        let item = MathUtil.add(coin.balance.emitted, amount);
        if (MathUtil.greaterThan(item, maximum)) {
            throw new CoinEmissionMaximumInvalidError(maximum);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(action: CoinAction, permission: ICoinPermissionEmission, coin: C, account: ICoinAccount, amount: string): Promise<void> {
        await CoinValidatorEmission.validate(permission, coin, amount);
    }

}