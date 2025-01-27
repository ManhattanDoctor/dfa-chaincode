import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { Coin, CoinGetCommand, ICoinGetDto } from '@hlf-core/coin';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import { CoinService } from '../service';
import * as _ from 'lodash';

@Injectable()
export class CoinGetHandler extends TransportCommandAsyncHandler<ICoinGetDto, Coin, CoinGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: ICoinGetDto, @StubHolder() holder: IUserStubHolder): Promise<Coin> {
        // return this.service.get(params.uid, params.details);
        return null;
    }

    protected checkResponse(response: Coin): Coin {
        return TransformUtil.fromClass(response);
    }
}
