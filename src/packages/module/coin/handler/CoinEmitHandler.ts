import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder, userRolesCheck } from '@hlf-core/transport-chaincode';
import { CoinEmitCommand, ICoinEmitDto } from '@project/common/hlf/auction/transport';
import { CoinService } from '../service';
import { IUserStubHolder, UserGuard } from '../../guard';
import { UserRole } from '@project/common/hlf/acl';
import * as _ from 'lodash';

@Injectable()
export class CoinEmitHandler extends TransportCommandAsyncHandler<ICoinEmitDto, void, CoinEmitCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinEmitCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinEmitDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await userRolesCheck(holder, UserRole.COIN_MANAGER);
        await this.service.emit(holder, params);
    }
}