import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger, Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import { UserAddCommand, IUserAddDto, UserAddDto } from '@project/common/hlf/transport';
import { StubHolder } from '@hlf-core/transport-chaincode';
import { User, UserRole } from '@project/common/hlf/user';
import { UserService } from '../service';
import { IUserStubHolder, UserGuard } from '@project/module/core/guard';
import * as _ from 'lodash';

@Injectable()
export class UserAddHandler extends TransportCommandAsyncHandler<IUserAddDto, User, UserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: UserService) {
        super(logger, transport, UserAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserAddDto, @StubHolder() holder: IUserStubHolder): Promise<User> {
        return this.service.add(holder, params);
    }

    protected checkRequest(request: IUserAddDto): IUserAddDto {
        return TransformUtil.toClass(UserAddDto, request);
    }

    protected checkResponse(response: User): User {
        return TransformUtil.fromClass(response);
    }
}
