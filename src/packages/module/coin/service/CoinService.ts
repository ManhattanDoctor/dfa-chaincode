import { Injectable } from '@nestjs/common';
import { CoinUtil as CoinUtilBase } from '@hlf-core/coin';
import { Logger, UID } from '@ts-core/common';
import { CoinEmittedEvent, } from '@hlf-core/coin';
import { IStub } from '@hlf-core/chaincode';
import { CoinAlreadyExistsError, CoinService as CoinServiceBase, ICoinManager } from '@hlf-core/coin-chaincode';
import { Variables } from '@project/common/hlf';
import { ICoin, CoinUtil, CoinType, CoinFactory, Coin } from '@project/common/hlf/coin';
import { IUserStubHolder } from '@project/module/core/guard';
import { CoinManager, CoinManagerNFT } from './manager';
import { CoinAddedEvent, ICoinAddDto } from '@project/common/hlf/transport';
import * as _ from 'lodash';

@Injectable()
export class CoinService extends CoinServiceBase<IUserStubHolder> {
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
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async add(holder: IUserStubHolder, params: ICoinAddDto): Promise<Coin> {
        let { ticker, type, data, decimals, permissions, series, ownerUid, emit } = params;
        let uid = CoinUtilBase.createUid(CoinUtil.createCoinId({ type, ticker, series }), decimals, ownerUid);
        if (await holder.stub.hasState(uid)) {
            throw new CoinAlreadyExistsError(uid);
        }

        let item = CoinFactory.transform({ uid, data, permissions, balance: { held: '0', inUse: '0', burned: '0', emitted: '0' } });
        let manager = this.getManager(holder.stub, item.uid);
        await manager.save(item);
        await holder.stub.dispatch(new CoinAddedEvent(item));

        if (!_.isNil(emit)) {
            await manager.emit(item, ownerUid, emit);
            await holder.stub.dispatch(new CoinEmittedEvent({ coinUid: item.uid, objectUid: ownerUid, amount: emit }));
        }
        return item;
    }

    public async seed(holder: IUserStubHolder): Promise<void> {
        let dto = CoinUtil.decomposeUid(Variables.seed.coin.uid) as ICoinAddDto;
        dto.emit = Variables.seed.coin.amount;
        await this.add(holder, dto);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected getManager<T extends ICoin>(stub: IStub, coinUid: string): ICoinManager<T> {
        let { type } = CoinUtil.decomposeUid(coinUid);
        switch (type) {
            case CoinType.NFT:
                return new CoinManagerNFT<T>(this.logger, stub);
            default:
                return new CoinManager<T>(this.logger, stub);
        }
    }
}
