import { Logger, LoggerLevel } from '@ts-core/common';
import { DynamicModule, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TransportFabricChaincodeModule } from '@project/module/core/transport';
import { LoggerModule } from '@ts-core/backend-nestjs';
import { ModeApplication } from '@ts-core/backend';
import { AppSettings } from './AppSettings';
import { Chaincode } from './Chaincode';
import { MetadataGetHandler, NonceGetHandler } from './handler';
//
import { UserModule } from '@project/module/user';
import { CoinModule } from '@project//module/coin';
import { SeedModule } from '@project//module/seed';

@Injectable()
export class AppModule extends ModeApplication implements OnApplicationBootstrap {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: AppSettings): DynamicModule {
        return {
            module: AppModule,
            imports: [
                LoggerModule.forRoot(settings),
                TransportFabricChaincodeModule.forRoot(settings),

                UserModule,
                CoinModule,
                SeedModule,
            ],
            providers: [
                {
                    provide: AppSettings,
                    useValue: settings
                },
                Chaincode
            ],
            controllers: [MetadataGetHandler, NonceGetHandler]
        };
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(logger: Logger, settings: AppSettings, chaincode: Chaincode) {
        super(chaincode.name, settings, logger);
        chaincode.internalLoggerLevel = LoggerLevel.NONE;
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async initialize(): Promise<void> { }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        await super.onApplicationBootstrap();
        await this.initialize();
    }
}
