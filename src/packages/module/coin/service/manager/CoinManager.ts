import { ICoinAccount } from '@hlf-core/coin';
import { CoinManager as CoinManagerBase, ICoinManager as ICoinManagerBase, ICoinAccountDetails } from '@hlf-core/coin-chaincode';
import { CoinAction, ICoin } from '@project/common/hlf/coin';
import { CoinValidatorFactory } from './validator';
import * as _ from 'lodash';

export class CoinManager<T extends ICoin> extends CoinManagerBase<T> {
    // --------------------------------------------------------------------------
    //
    //  Validate Methods
    //
    // --------------------------------------------------------------------------

    protected async actionValidate(action: CoinAction, coin: T, account?: ICoinAccount, amount?: string): Promise<void> {
        switch (action) {
            case CoinAction.EMIT:
            case CoinAction.BURN:
            case CoinAction.HOLD:
            case CoinAction.UNHOLD:
            case CoinAction.TRANSFER:
            case CoinAction.BURN_HELD:
            case CoinAction.EMIT_HELD:
                await this.actionValidateAccount(action, coin, account, amount);
                break;
        }
    }

    protected async actionValidateAccount(action: CoinAction, coin: T, account: ICoinAccount, amount: string): Promise<void> {
        if (!_.isEmpty(coin.permissions)) {
            for (let permission of coin.permissions) {
                await CoinValidatorFactory.create(permission).validate(action, permission, coin, account, amount);
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async add(item: T): Promise<T> {
        await this.actionValidate(CoinAction.ADD, item);
        return super.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Override Methods
    //
    // --------------------------------------------------------------------------

    protected async _emit(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.EMIT, item.coin, item.account, amount);
        await super._emit(item, amount);
    }

    protected async _emitHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.EMIT_HELD, item.coin, item.account, amount);
        await super._emitHeld(item, amount);
    }

    protected async _burn(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.BURN, item.coin, item.account, amount);
        await super._burn(item, amount);
    }

    protected async _burnHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.BURN_HELD, item.coin, item.account, amount);
        await super._burnHeld(item, amount);
    }

    protected async _hold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.HOLD, item.coin, item.account, amount);
        await super._hold(item, amount);
    }

    protected async _unhold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.UNHOLD, item.coin, item.account, amount);
        await super._unhold(item, amount);
    }

    protected async _transfer(coin: T, from: ICoinAccount, to: ICoinAccount, amount: string): Promise<void> {
        await this.actionValidate(CoinAction.TRANSFER, coin, to, amount);
        await super._transfer(coin, from, to, amount);
    }
}

export interface ICoinManager<T extends ICoin = ICoin> extends ICoinManagerBase<T> {
    add(item: T): Promise<T>;
}