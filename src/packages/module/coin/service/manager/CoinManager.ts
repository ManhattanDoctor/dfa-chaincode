import { ICoinAccount } from '@hlf-core/coin';
import { CoinManager as CoinManagerBase, ICoinAccountDetails } from '@hlf-core/coin-chaincode';
import { CoinBlacklistForbiddenError, CoinWhitelistForbiddenError } from '@project/common/hlf';
import { ICoin } from '@project/common/hlf/coin';
import * as _ from 'lodash';

export class CoinManager<T extends ICoin> extends CoinManagerBase<T> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async permissionsCheck(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        let { coin, account } = item;
        if (!_.isEmpty(coin.details?.permission?.list)) {
            await this.listPermissionCheck(coin, account);
        }
        if (!_.isEmpty(coin.details?.permission?.amount)) {
            await this.amountPermissionCheck(coin, account, amount);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  List Permission
    //
    // --------------------------------------------------------------------------

    protected async listPermissionCheck(coin: T, account: ICoinAccount): Promise<void> {
        let { list } = coin.details.permission;
        if (!_.isEmpty(list.white)) {
            await this.whitelistPermissionCheck(account, list.white);
        }
        if (!_.isEmpty(list.black)) {
            await this.blacklistPermissionCheck(account, list.black);
        }
    }
    protected async whitelistPermissionCheck(account: ICoinAccount, whitelist: Array<string>,): Promise<void> {
        if (!_.includes(whitelist, account.ownerUid)) {
            throw new CoinWhitelistForbiddenError(account.ownerUid);
        }
    }
    protected async blacklistPermissionCheck(account: ICoinAccount, blacklist: Array<string>): Promise<void> {
        if (_.includes(blacklist, account.ownerUid)) {
            throw new CoinBlacklistForbiddenError(account.ownerUid);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Amount Permission
    //
    // --------------------------------------------------------------------------

    protected async amountPermissionCheck(coin: T, account: ICoinAccount, amount: string): Promise<void> {
        let { discrete, minimum, maximum } = coin.details.permission.amount;
        if (!_.isNil(minimum)) {
            await this.amountMinimumPermissionCheck(account, minimum, amount);
        }
        if (!_.isNil(maximum)) {
            await this.amountMaximumPermissionCheck(account, maximum, amount);
        }
        if (!_.isNil(discrete)) {
            await this.amountDiscretePermissionCheck(account, discrete, amount);
        }
    }
    protected async amountMinimumPermissionCheck(account: ICoinAccount, minimum: string, amount: string): Promise<void> {

    }
    protected async amountMaximumPermissionCheck(account: ICoinAccount, maximum: string, amount: string): Promise<void> {

    }
    protected async amountDiscretePermissionCheck(account: ICoinAccount, discrete: string, amount: string): Promise<void> {

    }

    // --------------------------------------------------------------------------
    //
    //  Override Methods
    //
    // --------------------------------------------------------------------------

    protected async _emit(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._emit(item, amount);
    }

    protected async _emitHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._emitHeld(item, amount);
    }

    protected async _burn(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._burn(item, amount);
    }

    protected async _burnHeld(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._burnHeld(item, amount);
    }

    protected async _hold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._hold(item, amount);
    }

    protected async _unhold(item: ICoinAccountDetails<T>, amount: string): Promise<void> {
        await this.permissionsCheck(item, amount);
        await super._unhold(item, amount);
    }

    protected async _transfer(coin: T, from: ICoinAccount, to: ICoinAccount, amount: string): Promise<void> {
        await this.permissionsCheck({ coin, account: to }, amount);
        await super._transfer(coin, from, to, amount);
    }
}