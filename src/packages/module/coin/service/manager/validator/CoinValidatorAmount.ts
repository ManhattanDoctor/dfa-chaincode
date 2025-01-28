import { ICoinAccount } from '@hlf-core/coin';
import { ICoin } from '@project/common/hlf/coin';
import { ICoinPermissionAmount } from '@project/common/hlf/coin/permission';
import { CoinValidator } from './ICoinValidator';
import * as _ from 'lodash';

export class CoinValidatorAmount<C extends ICoin> extends CoinValidator<C, ICoinPermissionAmount> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(permission: ICoinPermissionAmount, coin: C, account: ICoinAccount, amount: string): Promise<void> {
        await this.amountCheck(coin, account, permission, amount);
    }

    // --------------------------------------------------------------------------
    //
    //  Amount 
    //
    // --------------------------------------------------------------------------

    protected async amountCheck(coin: C, account: ICoinAccount, permission: ICoinPermissionAmount, amount: string): Promise<void> {
        let { discrete, minimum, maximum } = permission;
        if (!_.isNil(minimum)) {
            await this.amountMinimumCheck(coin, account, minimum, amount);
        }
        if (!_.isNil(maximum)) {
            await this.amountMaximumCheck(coin, account, maximum, amount);
        }
        if (!_.isNil(discrete)) {
            await this.amountDiscreteCheck(coin, account, discrete, amount);
        }
    }
    protected async amountMinimumCheck(coin: C, account: ICoinAccount, minimum: string, amount: string): Promise<void> {

    }
    protected async amountMaximumCheck(coin: C, account: ICoinAccount, maximum: string, amount: string): Promise<void> {

    }
    protected async amountDiscreteCheck(coin: C, account: ICoinAccount, discrete: string, amount: string): Promise<void> {

    }
}