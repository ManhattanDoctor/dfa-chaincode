import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder, userRolesCheck } from '@hlf-core/transport-chaincode';
import { UserRole } from '@project/common/hlf';
import { CoinBurnCommand, ICoinEmitDto } from '@project/common/hlf/transport';
import { IUserStubHolder, UserGuard } from '../../guard';
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
        await userRolesCheck(holder, UserRole.USER_MANAGER);
        await this.service.burn(holder, params);
    }
}
