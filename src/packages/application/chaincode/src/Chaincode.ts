import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common';
import { SeedService } from '@project/module/seed/service';
import { TransportFabricChaincodeReceiver, TransportFabricSeededChaincode } from '@hlf-core/transport-chaincode';
import * as _ from 'lodash';

@Injectable()
export class Chaincode extends TransportFabricSeededChaincode<SeedService> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, seeder: SeedService) {
        super(logger, transport, seeder);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return 'DFA';
    }
}