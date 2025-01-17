import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { NonceGetCommand } from '@hlf-core/transport-common';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { StubHolder, TransportFabricChaincodeReceiver } from '@hlf-core/transport-chaincode';
import * as _ from 'lodash';

@Injectable()
export class NonceGetHandler extends TransportCommandAsyncHandler<string, string, NonceGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, NonceGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: string, @StubHolder() holder: IUserStubHolder): Promise<string> {
        let item = await holder.stub.getStateRaw(TransportFabricChaincodeReceiver.createNonceKey(params));
        return !_.isNil(item) ? item : '0';
    }
}
