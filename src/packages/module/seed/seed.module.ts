import { Module } from '@nestjs/common';
import { SeedGetHandler } from './handler';
import { SeedService } from './service';
import { UserModule } from '@project/module/user';
import { CoinModule } from '@project/module/coin';

@Module({
    imports: [UserModule, CoinModule],
    controllers: [SeedGetHandler],
    providers: [SeedService],
    exports: [SeedService]
})
export class SeedModule { }
