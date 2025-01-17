import { ITransportFabricChaincodeSettingsBatch, ITransportFabricSettingsBatch } from '@hlf-core/transport-chaincode';
import { DateUtil, TransportCryptoManagerEd25519, AbstractSettingsStorage, ITransportCryptoManager } from '@ts-core/common';
import { LoggerSettings } from '@ts-core/backend';
import { ChaincodeMetadataGetCommand, ChaincodeMode } from '@hlf-core/transport-common';
import { ChaincodeServerOpts } from 'fabric-shim';
import * as _ from 'lodash';
import { NON_SIGNED_COMMANDS } from '@project/common/hlf/transport';

export class AppSettings extends LoggerSettings implements ITransportFabricChaincodeSettingsBatch {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _cryptoManagers: Array<ITransportCryptoManager>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this._cryptoManagers = [new TransportCryptoManagerEd25519()];
    }

    // --------------------------------------------------------------------------
    //
    //  Chaincode Properties
    //
    // --------------------------------------------------------------------------

    public get chaincodeMode(): ChaincodeMode {
        return this.getValue('CHAINCODE_MODE', ChaincodeMode.INTERNAL);
    }

    public get chaincodeServerOptions(): ChaincodeServerOpts {
        return { ccid: this.getValue('CORE_CHAINCODE_ID'), address: this.getValue('CORE_CHAINCODE_ADDRESS'), tlsProps: null }
    }

    // --------------------------------------------------------------------------
    //
    //  Transport Properties
    //
    // --------------------------------------------------------------------------

    public get cryptoManagers(): Array<ITransportCryptoManager> {
        return this._cryptoManagers;
    }

    public get nonSignedCommands(): Array<string> {
        return _.concat(NON_SIGNED_COMMANDS, ChaincodeMetadataGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Batch Properties
    //
    // --------------------------------------------------------------------------

    public get isBatch(): boolean {
        return AbstractSettingsStorage.parseBoolean(this.getValue('FABRIC_IS_BATCH', true));
    }

    public get batch(): ITransportFabricSettingsBatch {
        return this.isBatch ? {
            timeout: this.getValue('FABRIC_BATCH_TIMEOUT', DateUtil.MILLISECONDS_SECOND),
            algorithm: this.getValue('FABRIC_BATCH_ALGORITHM', TransportCryptoManagerEd25519.ALGORITHM),
            publicKey: this.getValue('FABRIC_BATCH_PUBLIC_KEY', 'e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8'),
        } : null
    }
}