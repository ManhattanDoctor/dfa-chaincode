import { DynamicModule, Provider } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import { TransportFabricChaincodeReceiver, TransportFabricChaincodeReceiverBatch, ITransportFabricChaincodeSettingsBatch, ITransportFabricChaincodeSettings } from '@hlf-core/transport-chaincode';
import * as _ from 'lodash';

export class TransportFabricChaincodeModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot<S extends ITransportFabricChaincodeSettingsBatch>(settings: S): DynamicModule {
        let providers: Array<Provider> = [
            {
                inject: [Logger],
                provide: TransportFabricChaincodeReceiver,
                useFactory: (logger: Logger) => !_.isNil(settings.batch) ? new TransportFabricChaincodeReceiverBatch(logger, settings) : new TransportFabricChaincodeReceiver(logger, settings)
            },
            { provide: Transport, useExisting: TransportFabricChaincodeReceiver }
        ];
        return { module: TransportFabricChaincodeModule, exports: providers, global: true, providers };
    }
}
