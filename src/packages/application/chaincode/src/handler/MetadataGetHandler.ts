import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { ChaincodeMetadataGetCommand, IChaincodeMetadata } from '@hlf-core/transport-common';
import { AppSettings } from '../AppSettings';
import { Chaincode } from '../Chaincode';
import * as _ from 'lodash';

@Injectable()
export class MetadataGetHandler extends TransportCommandAsyncHandler<void, IChaincodeMetadata, ChaincodeMetadataGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private settings: AppSettings, private chaincode: Chaincode) {
        super(logger, transport, ChaincodeMetadataGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<IChaincodeMetadata> {
        return { name: this.chaincode.name, mode: this.settings.chaincodeMode, batch: this.settings.batch };
    }
}
