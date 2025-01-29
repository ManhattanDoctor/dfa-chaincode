import { Module } from '@nestjs/common';
import { CoinGetHandler, CoinAddHandler, CoinBalanceGetHandler, CoinEmitHandler, CoinBurnHandler, CoinTransferHandler } from './handler';
import { CoinService } from './service';

@Module({
    controllers: [
        CoinGetHandler,
        CoinAddHandler,
        CoinEmitHandler,
        CoinBurnHandler,
        CoinTransferHandler,
        CoinBalanceGetHandler
    ],
    providers: [CoinService],
    exports: [CoinService]
})
export class CoinModule { }
