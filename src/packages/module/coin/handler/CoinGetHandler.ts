import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { Coin } from '@hlf-core/common';
import { StubHolder, CoinManager } from '@hlf-core/transport-chaincode';
import { CoinGetCommand, ICoinGetDto } from '@project/common/hlf/auction/transport';
import { IUserStubHolder, UserGuard } from '../../guard';
import { CoinNotFoundError } from '@project/common/hlf/auction';
import * as _ from 'lodash';

@Injectable()
export class CoinGetHandler extends TransportCommandAsyncHandler<ICoinGetDto, Coin, CoinGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CoinGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: ICoinGetDto, @StubHolder() holder: IUserStubHolder): Promise<Coin> {
        let item = await new CoinManager(this.logger, holder.stub).get(params.uid, params.details);
        if (_.isNil(item)) {
            throw new CoinNotFoundError(params.uid);
        }
        return item;
    }

    protected checkResponse(response: Coin): Coin {
        return TransformUtil.fromClass(response);
    }
}
