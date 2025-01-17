import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { IUserGetDto, UserGetCommand } from '@project/common/hlf/acl/transport';
import { User } from '@project/common/hlf/acl';
import { UserService } from '../service';
import * as _ from 'lodash';

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
