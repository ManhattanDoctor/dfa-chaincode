import { User } from '@project/common/hlf/';
import { ITransportCommand } from '@ts-core/common';
import { IUserStubHolder as IUserStubHolderBase } from '@hlf-core/transport-chaincode';
import { UserManager } from '@project/module/core/database';
import * as _ from 'lodash';

export interface IUserStubHolder<U = any> extends IUserStubHolderBase<User>, ITransportCommand<U> {
    manager?: UserManager;
}