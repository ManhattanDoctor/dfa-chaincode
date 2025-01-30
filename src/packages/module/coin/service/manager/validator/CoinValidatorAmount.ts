import { MathUtil } from '@ts-core/common';
import { ICoinAccount } from '@hlf-core/coin';
import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { ICoinPermissionAmount } from '@project/common/hlf/coin/permission';
import { CoinValidator } from './ICoinValidator';
import { CoinAmountDiscreteInvalidError, CoinAmountMaximumInvalidError } from '@project/common/hlf';
import * as _ from 'lodash';

export class CoinValidatorAmount<C extends ICoin> extends CoinValidator<C, ICoinPermissionAmount> {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static async validate(permission: ICoinPermissionAmount, coin: ICoin, account?: ICoinAccount, amount?: string): Promise<void> {
        await CoinValidatorAmount.check(permission, amount);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private static modulo(first: string, second: string): string {
        if (MathUtil.isInvalid(first) || MathUtil.isInvalid(second)) {
            return null;
        }
        return MathUtil.toString(MathUtil.new(first).modulo(MathUtil.new(second)));
    }

    private static async check(permission: ICoinPermissionAmount, amount: string): Promise<void> {
        let { discrete, minimum, maximum } = permission;
        if (!_.isNil(minimum)) {
            await CoinValidatorAmount.minimumCheck(minimum, amount);
        }
        if (!_.isNil(maximum)) {
            await CoinValidatorAmount.maximumCheck(maximum, amount);
        }
        if (!_.isNil(discrete)) {
            await CoinValidatorAmount.discreteCheck(discrete, amount);
        }
    }
    private static async minimumCheck(minimum: string, amount: string): Promise<void> {
        if (MathUtil.lessThan(amount, minimum)) {
            throw new CoinAmountMaximumInvalidError(minimum);
        }
    }
    private static async maximumCheck(maximum: string, amount: string): Promise<void> {
        if (MathUtil.greaterThan(amount, maximum)) {
            throw new CoinAmountMaximumInvalidError(maximum);
        }
    }
    private static async discreteCheck(discrete: string, amount: string): Promise<void> {
        if (CoinValidatorAmount.modulo(amount, discrete) !== '0') {
            throw new CoinAmountDiscreteInvalidError(discrete);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    public async validate(action: CoinAction, permission: ICoinPermissionAmount, coin: C, account: ICoinAccount, amount: string): Promise<void> {
        await CoinValidatorAmount.validate(permission, coin, account, amount);
    }

}