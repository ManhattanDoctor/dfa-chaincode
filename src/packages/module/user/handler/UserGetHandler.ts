import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { IUserGetDto, UserGetCommand } from '@project/common/hlf/transport';
import { User } from '@project/common/hlf/user';
import { UserService } from '../service';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import * as _ from 'lodash';
import { UserManager } from '@project/module/core/database';

@Injectable()
export class UserGetHandler extends TransportCommandAsyncHandler<IUserGetDto, User, UserGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: UserService) {
        super(logger, transport, UserGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: IUserGetDto, @StubHolder() holder: IUserStubHolder): Promise<User> {
        return this.service.get(holder, params);
    }
}
