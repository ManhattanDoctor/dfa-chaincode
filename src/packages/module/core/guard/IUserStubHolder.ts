import { User } from '@project/common/hlf/user';
import { ITransportCommand } from '@ts-core/common';
import { UserManager } from '@project/module/core/database';
import { IStubHolder } from '@hlf-core/chaincode';
import * as _ from 'lodash';

export interface IUserStubHolder<U = any> extends IStubHolder, ITransportCommand<U> {
    user?: User;
    manager?: UserManager;
}