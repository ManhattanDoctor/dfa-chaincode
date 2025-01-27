import { Injectable } from '@nestjs/common';
import { Logger, TransformUtil } from '@ts-core/common';
import { Coin, CoinEmittedEvent, } from '@hlf-core/coin';
import { IStub } from '@hlf-core/chaincode';
import { CoinService as CoinServiceBase, ICoinManager } from '@hlf-core/coin-chaincode';
import { Variables } from '@project/common/hlf';
import { ICoin, CoinUtil, CoinDetails } from '@project/common/hlf/coin';
import { IUserStubHolder } from '@project/module/core/guard';
import { CoinManager } from './manager';
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
    //  Seed Methods
    //
    // --------------------------------------------------------------------------

    public async seed(holder: IUserStubHolder): Promise<void> {
        let item = CoinUtil.create(Coin, Variables.seed.coin.coinId, Variables.seed.coin.decimals, Variables.seed.coin.ownerUid);
        let manager = this.getManager(holder.stub, item.uid);
        await manager.save(item);

        await manager.emit(item, Variables.seed.user.uid, Variables.seed.coin.amount);
        await holder.stub.dispatch(new CoinEmittedEvent({ coinUid: item.uid, objectUid: Variables.seed.user.uid, amount: Variables.seed.coin.amount }));

        let details = TransformUtil.toClass(CoinDetails, { series: { uid: 'FLAT', index: '13' } });
        let item2 = CoinUtil.create(Coin, 'RUB_NF', Variables.seed.coin.decimals, Variables.seed.coin.ownerUid, details);
        manager = this.getManager(holder.stub, item.uid);
        console.log(item);
        console.log(item2);
        await manager.save(item2);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected getManager<T extends ICoin>(stub: IStub, coinUid: string): ICoinManager<T> {
        return new CoinManager<T>(this.logger, stub);
    }
}
