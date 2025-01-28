import { CoinManager } from './CoinManager';
import { ICoin } from '@project/common/hlf/coin';
import { ICoinAccountDetails } from '@hlf-core/coin-chaincode';
import { CoinValidatorAmount } from './validator/CoinValidatorAmount';
import { CoinPermissionType } from '@project/common/hlf/coin/permission';
import * as _ from 'lodash';

export class CoinManagerNFT<T extends ICoin = ICoin> extends CoinManager<T> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async validate(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await super.validate(item, amount);
        new CoinValidatorAmount().validate({ type: CoinPermissionType.AMOUNT, discrete: '1', minimum: '1', maximum: '1' }, item.coin, item.account, amount);
    }
}