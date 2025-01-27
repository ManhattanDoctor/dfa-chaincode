import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import { SeedService } from '../service';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { SeedGetCommand } from '@project/common/hlf/transport';
import { ISeed } from '@project/common/hlf';
import * as _ from 'lodash';

@Injectable()
export class SeedGetHandler extends TransportCommandAsyncHandler<void, ISeed, SeedGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: SeedService) {
        super(logger, transport, SeedGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: void, @StubHolder() holder: IUserStubHolder): Promise<ISeed> {
        return this.service.get(holder.stub);
    }
}
