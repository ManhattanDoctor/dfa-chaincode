import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransformUtil, TransportCommandAsyncHandler } from '@ts-core/common';
import { UserEditCommand, IUserEditDto, UserEditDto } from '@project/common/hlf/transport';
import { User, UserRole } from '@project/common/hlf';
import { StubHolder, userRolesCheck } from '@hlf-core/transport-chaincode';
import { UserService } from '../service';
import * as _ from 'lodash';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';

@Injectable()
export class UserEditHandler extends TransportCommandAsyncHandler<IUserEditDto, User, UserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: UserService) {
        super(logger, transport, UserEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserEditDto, @StubHolder() holder: IUserStubHolder): Promise<User> {
        await userRolesCheck(holder, UserRole.USER_MANAGER);
        return this.service.edit(holder, params);
    }

    protected checkRequest(request: IUserEditDto): IUserEditDto {
        return TransformUtil.toClass(UserEditDto, request);
    }

    protected checkResponse(response: User): User {
        return TransformUtil.fromClass(response);
    }
}
