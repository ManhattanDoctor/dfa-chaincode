import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { CoinBurnCommand, ICoinEmitDto } from '@hlf-core/coin';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import { CoinService } from '../service';
import * as _ from 'lodash';

@Injectable()
export class CoinBurnHandler extends TransportCommandAsyncHandler<ICoinEmitDto, void, CoinBurnCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinBurnCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinEmitDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await this.service.burn(holder, params);
    }
}
