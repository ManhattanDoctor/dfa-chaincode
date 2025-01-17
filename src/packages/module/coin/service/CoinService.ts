import { Injectable } from '@nestjs/common';
import { UID, Logger, LoggerWrapper, ObjectUtil, MathUtil } from '@ts-core/common';
import { Coin, CoinBalance as HlfCoinBalance, CoinUtil, CoinAmountError } from '@hlf-core/common';
import { CoinManager } from '@hlf-core/transport-chaincode';
import { CoinAlreadyExistsError, CoinNotFoundError, CoinObjectNotFoundError, Variables as AuctionVariables, CoinTransferForbiddenError } from '@project/common/hlf/auction';
import { ICoinEmitDto, CoinTransferredEvent, CoinEmittedEvent, CoinBurnedEvent, ICoinHoldDto, CoinHoldedEvent, CoinUnholdedEvent, ICoinTransferDto, ICoinBalanceGetDto, } from '@project/common/hlf/auction/transport';
import { IUserStubHolder } from '../../guard';
import { Variables as AclVariables } from '@project/common/hlf/acl';
import { CoinBalance } from '@project/common/platform';
import * as _ from 'lodash';

@Injectable()
export class CoinService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Add Methods
    //
    // --------------------------------------------------------------------------

    public async add(holder: IUserStubHolder, coinId: string, decimals: number, owner: UID, emit?: Partial<ICoinEmitDto>): Promise<Coin> {
        let uid = CoinUtil.createUid(coinId, decimals, owner);
        if (await holder.stub.hasState(uid)) {
            throw new CoinAlreadyExistsError(uid);
        }

        let item = CoinUtil.create(Coin, coinId, decimals, owner);
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.save(item);

        if (!_.isNil(emit)) {
            await manager.emit(item, emit.objectUid, emit.amount);
            await holder.stub.dispatch(new CoinEmittedEvent({ coinUid: item.uid, objectUid: emit.objectUid, amount: emit.amount }));
        }
        return item;
    }

    public async addRoot(holder: IUserStubHolder): Promise<void> {
        let item = CoinUtil.create(Coin, AuctionVariables.coin.coinId, AuctionVariables.coin.decimals, AuctionVariables.coin.ownerUid);
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.save(item);

        await manager.emit(item, AclVariables.root.uid, AuctionVariables.coin.amount);
        await holder.stub.dispatch(new CoinEmittedEvent({ coinUid: item.uid, objectUid: AclVariables.root.uid, amount: AuctionVariables.coin.amount }));
    }

    // --------------------------------------------------------------------------
    //
    //  Emit / Burn Methods
    //
    // --------------------------------------------------------------------------

    public async emit(holder: IUserStubHolder, params: ICoinEmitDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.objectUid)) {
            throw new CoinObjectNotFoundError(params.objectUid);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.emit(params.coinUid, params.objectUid, params.amount);
        await holder.stub.dispatch(new CoinEmittedEvent(params));
    }

    public async emitHeld(holder: IUserStubHolder, params: ICoinEmitDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.objectUid)) {
            throw new CoinObjectNotFoundError(params.objectUid);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.emitHeld(params.coinUid, params.objectUid, params.amount);
        await holder.stub.dispatch(new CoinEmittedEvent(params));
    }

    public async burn(holder: IUserStubHolder, params: ICoinEmitDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.objectUid)) {
            throw new CoinObjectNotFoundError(params.objectUid);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.burn(params.coinUid, params.objectUid, params.amount);
        await holder.stub.dispatch(new CoinBurnedEvent(params));
    }

    public async burnHeld(holder: IUserStubHolder, params: ICoinEmitDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.objectUid)) {
            throw new CoinObjectNotFoundError(params.objectUid);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.burnHeld(params.coinUid, params.objectUid, params.amount);
        await holder.stub.dispatch(new CoinBurnedEvent(params));
    }

    // --------------------------------------------------------------------------
    //
    //  Hold Methods
    //
    // --------------------------------------------------------------------------

    public async hold(holder: IUserStubHolder, params: ICoinHoldDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.from)) {
            throw new CoinObjectNotFoundError(params.from);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.hold(params.coinUid, params.from, params.amount);
        await holder.stub.dispatch(new CoinHoldedEvent({ coinUid: params.coinUid, amount: params.amount, objectUid: params.from }));
    }

    public async unhold(holder: IUserStubHolder, params: ICoinHoldDto): Promise<void> {
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (await holder.stub.hasNotState(params.from)) {
            throw new CoinObjectNotFoundError(params.from);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.unhold(params.coinUid, params.from, params.amount);
        await holder.stub.dispatch(new CoinUnholdedEvent({ coinUid: params.coinUid, amount: params.amount, objectUid: params.from }));
    }

    // --------------------------------------------------------------------------
    //
    //  Transfer Methods
    //
    // --------------------------------------------------------------------------

    public async transfer(holder: IUserStubHolder, params: ICoinTransferDto): Promise<void> {
        if (await holder.stub.hasNotState(params.to)) {
            throw new CoinObjectNotFoundError(params.to);
        }
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }
        if (holder.user.uid === AclVariables.team.uid) {
            throw new CoinTransferForbiddenError(holder.user);
        }
        let manager = new CoinManager(this.logger, holder.stub);
        await manager.transfer(params.coinUid, holder.user.uid, params.to, params.amount);
        await holder.stub.dispatch(new CoinTransferredEvent({ coinUid: params.coinUid, from: holder.user.uid, to: params.to, amount: params.amount }));
    }

    // --------------------------------------------------------------------------
    //
    //  Other Methods
    //
    // --------------------------------------------------------------------------

    public async balanceGet(holder: IUserStubHolder, params: ICoinBalanceGetDto): Promise<CoinBalance> {
        if (await holder.stub.hasNotState(params.objectUid)) {
            throw new CoinObjectNotFoundError(params.objectUid);
        }
        if (await holder.stub.hasNotState(params.coinUid)) {
            throw new CoinNotFoundError(params.coinUid);
        }

        let manager = new CoinManager(this.logger, holder.stub);
        let account = await manager.accountGet(params.coinUid, params.objectUid);

        let item = new CoinBalance();
        ObjectUtil.copyPartial(account, item, ['held', 'inUse']);
        item.total = MathUtil.add(item.held, item.inUse);
        return item;
    }

    public async checkInUseAmount(holder: IUserStubHolder, object: UID, amount: string): Promise<void> {
        let coin = new CoinManager(this.logger, holder.stub);
        let account = await coin.accountGet(AuctionVariables.coin.uid, object);
        if (MathUtil.lessThan(account.inUse, amount)) {
            throw new CoinAmountError(`Not enough "${AuctionVariables.coin.uid}" to create auction`, { inUse: account.inUse, amount });
        }
    }
}