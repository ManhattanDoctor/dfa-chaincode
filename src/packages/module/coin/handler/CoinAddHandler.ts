import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { CoinService } from '../service';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import { CoinAddCommand, ICoinAddDto } from '@project/common/hlf/transport';
import { Coin } from '@project/common/hlf/coin';
import * as _ from 'lodash';

@Injectable()
export class CoinAddHandler extends TransportCommandAsyncHandler<ICoinAddDto, Coin, CoinAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinAddDto, @StubHolder() holder: IUserStubHolder): Promise<Coin> {
        params.ownerUid = holder.user.uid;
        return this.service.add(holder, params);
    }
}
