import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { CoinService } from '../service';
import { CoinBalance, CoinBalanceGetCommand, ICoinBalanceGetDto } from '@hlf-core/coin';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import * as _ from 'lodash';

@Injectable()
export class CoinBalanceGetHandler extends TransportCommandAsyncHandler<ICoinBalanceGetDto, CoinBalance, CoinBalanceGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinBalanceGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: ICoinBalanceGetDto, @StubHolder() holder: IUserStubHolder): Promise<CoinBalance> {
        return this.service.balanceGet(holder, params);
    }

    protected checkResponse(response: CoinBalance): CoinBalance {
        return TransformUtil.fromClass(response);
    }
}
