import { Logger, LoggerLevel, ValidateUtil } from '@ts-core/common';
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
import { CoinService } from '@project/module/coin/service';
import { CoinType } from '@project/common/hlf/coin';
import { Variables } from '@project/common/hlf';

import { CoinBalance, ICoinBalance } from "@hlf-core/coin";
import { CoinPermissionType } from '@project/common/hlf/coin/permission';

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

    public constructor(logger: Logger, settings: AppSettings, chaincode: Chaincode, private coin: CoinService) {
        super(chaincode.name, settings, logger);
        chaincode.internalLoggerLevel = LoggerLevel.NONE;
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async initialize(): Promise<void> {
        /*
        let data = {
            name: 'Renat',
            type: 'LOAN'
        };
        let permissions = [
            { type: CoinPermissionType.AMOUNT, minimum: '10' },
            { type: CoinPermissionType.WHITELIST, objects: ['asaasdasd'] },
            { type: CoinPermissionType.BLACKLIST, objects: ['asad'] }
        ];

        let item = this.coin.create({ type: CoinType.NFT, ticker: 'FLAT' }, Variables.seed.coin.decimals, Variables.seed.coin.ownerUid, permissions, data);
        console.log(item);
        try {
            console.log(ValidateUtil.validate(item));
        }
        catch (error) {
            console.log(error);
        }
        */
    }

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
