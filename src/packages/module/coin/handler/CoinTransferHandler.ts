import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { CoinService } from '../service';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import { CoinTransferCommand, ICoinTransferDto } from '@hlf-core/coin';
import * as _ from 'lodash';

@Injectable()
export class CoinTransferHandler extends TransportCommandAsyncHandler<ICoinTransferDto, void, CoinTransferCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinTransferCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinTransferDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await this.service.transfer(holder, params);
    }
}
