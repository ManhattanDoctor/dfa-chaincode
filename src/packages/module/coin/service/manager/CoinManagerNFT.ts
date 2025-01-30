import { CoinManager } from './CoinManager';
import { CoinAction, CoinUtil, ICoin } from '@project/common/hlf/coin';
import { CoinValidatorAmount, CoinValidatorEmission } from './validator';
import { CoinPermissionType } from '@project/common/hlf/coin/permission';
import { CoinDecimalsInvalidError } from '@project/common/hlf';
import { ICoinAccount } from '@hlf-core/coin';
import * as _ from 'lodash';

export class CoinManagerNFT<T extends ICoin = ICoin> extends CoinManager<T> {

    // --------------------------------------------------------------------------
    //
    //  Validate Methods
    //
    // --------------------------------------------------------------------------

    protected async actionValidate(action: CoinAction, coin: T, account?: ICoinAccount, amount?: string): Promise<void> {
        await super.actionValidate(action, coin, account, amount);
        switch (action) {
            case CoinAction.ADD:
                await this.actionValidateAdd(coin);
                break;
        }
    }

    protected async actionValidateAdd(item: T): Promise<void> {
        if (CoinUtil.decomposeUid(item).decimals !== 0) {
            throw new CoinDecimalsInvalidError(0);
        }
    }
    protected async actionValidateAccount(action: CoinAction, coin: T, account: ICoinAccount, amount: string): Promise<void> {
        switch (action) {
            case CoinAction.EMIT:
                await CoinValidatorEmission.validate({ type: CoinPermissionType.EMISSION, maximum: '1' }, coin, amount);
                break;
        }
        await CoinValidatorAmount.validate({ type: CoinPermissionType.AMOUNT, minimum: '1', maximum: '1' }, coin, account, amount);
        await super.actionValidateAccount(action, coin, account, amount);
    }
}