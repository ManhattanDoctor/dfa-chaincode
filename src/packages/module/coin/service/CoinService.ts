import { Injectable } from '@nestjs/common';
import { CoinBalance, CoinUtil as CoinUtilBase, ICoinUidDecomposition } from '@hlf-core/coin';
import { ClassType, Logger, TransformUtil, UID } from '@ts-core/common';
import { Coin, CoinEmittedEvent, } from '@hlf-core/coin';
import { IStub } from '@hlf-core/chaincode';
import { CoinService as CoinServiceBase, ICoinManager } from '@hlf-core/coin-chaincode';
import { Variables } from '@project/common/hlf';
import { ICoin, CoinUtil, CoinType, ICoinId, CoinFactory } from '@project/common/hlf/coin';
import { IUserStubHolder } from '@project/module/core/guard';
import { CoinManager, CoinManagerNFT } from './manager';
import * as _ from 'lodash';
import { CoinPermissionType, ICoinPermission } from '@project/common/hlf/coin/permission';
import { ICoinData } from '@project/common/hlf/coin/data';

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

    public create<T extends ICoin>(id: ICoinId, decimals: number, owner: UID, permissions?: Array<ICoinPermission>, data?: ICoinData): T {
        let coinId = CoinUtil.createCoinId(id);
        let { type } = CoinUtil.decomposeUid(coinId);
        if (type === CoinType.NFT) {
            decimals = 0;
        }
        let item = {
            uid: CoinUtilBase.createUid(coinId, decimals, owner),
            balance: { held: '0', inUse: '0', burned: '0', emitted: '0' },
            permissions,
            data
        };
        return CoinFactory.transform<T>(item);
    }

    public async seed(holder: IUserStubHolder): Promise<void> {
        let decomposition = CoinUtil.decomposeUid(Variables.seed.coin.uid);
        let item = this.create(decomposition, decomposition.decimals, decomposition.ownerUid);
        let manager = this.getManager(holder.stub, item.uid);
        await manager.save(item);

        await manager.emit(item, Variables.seed.user.uid, Variables.seed.coin.amount);
        await holder.stub.dispatch(new CoinEmittedEvent({ coinUid: item.uid, objectUid: Variables.seed.user.uid, amount: Variables.seed.coin.amount }));

        let permissions = [{ type: CoinPermissionType.AMOUNT, minimum: '0' }];
        let data = { name: 'Renat' };
        let item2 = this.create({ ticker: 'FLAT', type: CoinType.NFT }, Variables.seed.coin.decimals, Variables.seed.coin.ownerUid, permissions, data);
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
        let { type } = CoinUtil.decomposeUid(coinUid);
        switch (type) {
            case CoinType.NFT:
                return new CoinManagerNFT<T>(this.logger, stub);
            default:
                return new CoinManager<T>(this.logger, stub);
        }
    }
}
