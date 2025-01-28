import { ICoinAccount } from '@hlf-core/coin';
import { CoinManager as CoinManagerBase, ICoinAccountDetails } from '@hlf-core/coin-chaincode';
import { ICoin } from '@project/common/hlf/coin';
import { CoinValidatorFactory } from './validator';
import * as _ from 'lodash';

export class CoinManager<T extends ICoin> extends CoinManagerBase<T> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async validate(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        for (let permission of item.coin?.permissions) {
            await CoinValidatorFactory.create(permission).validate(permission, item.coin, item.account, amount);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Override Methods
    //
    // --------------------------------------------------------------------------

    protected async _emit(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._emit(item, amount);
    }

    protected async _emitHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._emitHeld(item, amount);
    }

    protected async _burn(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._burn(item, amount);
    }

    protected async _burnHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._burnHeld(item, amount);
    }

    protected async _hold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._hold(item, amount);
    }

    protected async _unhold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.validate(item, amount);
        await super._unhold(item, amount);
    }

    protected async _transfer(coin: T, from: ICoinAccount, to: ICoinAccount, amount: string): Promise<void> {
        await this.validate({ coin, account: to }, amount);
        await super._transfer(coin, from, to, amount);
    }
}