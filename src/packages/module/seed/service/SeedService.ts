import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger } from '@ts-core/common';
import { UserService } from '@project/module/user/service';
import { IUserStubHolder } from '@project/module/core/guard';
import { Seeder, TransportFabricChaincodeReceiver } from '@hlf-core/transport-chaincode';
import { ISeed, Seed, Variables } from '@project/common/hlf';
import { UserManager } from '@project/module/core/database';
import { ChaincodeStub } from 'fabric-shim';
import { CoinService } from '@project/module/coin/service';

@Injectable()
export class SeedService extends Seeder<ISeed, IUserStubHolder> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private user: UserService, private coin: CoinService) {
        super(logger, transport);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async add(holder: IUserStubHolder): Promise<ISeed> {
        this.log(`Adding seed user "${Variables.seed.user.uid}"...`);
        await this.user.seed(holder);

        this.log(`Adding seed ${Variables.seed.coin.coinId}" coin...`);
        await this.coin.addRoot(holder);
        return TransformUtil.toClass(Seed, { created: holder.stub.transaction.date });
    }

    protected holderGet(stub: ChaincodeStub): IUserStubHolder {
        let item = super.holderGet(stub);
        item.manager = new UserManager(this.logger, item.stub);
        return item;
    }
}
