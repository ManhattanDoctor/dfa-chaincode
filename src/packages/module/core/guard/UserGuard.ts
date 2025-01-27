import { getStubHolder } from '@hlf-core/transport-chaincode';
import { UserStatusForbiddenError, UserNotFoundError, UserCryptoKeyInvalidError, UserCryptoKeyNotFoundError } from '@project/common/hlf';
import { UserStatus } from '@project/common/hlf/user';
import { UserManager } from '@project/module/core/database';
import { IUserStubHolder } from './IUserStubHolder';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Public Methods
//
// --------------------------------------------------------------------------

export const UserGuard = (options?: IUserGuardOptions): any => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (_.isNil(options)) {
            options = { isNeedCheck: true };
        }
        let originalMethod = descriptor.value;
        descriptor.value = async function (...args): Promise<any> {
            let holder = await getUserStubHolder(target, args);
            await validateUserStubHolder(holder, options);
            return originalMethod.apply(this, args);
        };
    };
};

// --------------------------------------------------------------------------
//
//  Private Methods
//
// --------------------------------------------------------------------------

interface IUserGuardOptions {
    isNeedCheck?: boolean;
}

async function validateUserStubHolder<U>(item: IUserStubHolder<U>, options: IUserGuardOptions): Promise<void> {
    if (_.isEmpty(options) || !options.isNeedCheck) {
        return;
    }

    let { id } = item.stub.user;
    let { user } = item;
    if (_.isNil(user)) {
        item.manager = new UserManager(this.logger, item.stub)
        item.user = user = await item.manager.get(id, ['cryptoKey']);
    }
    if (_.isNil(user)) {
        throw new UserNotFoundError(id);
    }

    let { status, cryptoKey } = user;
    if (status !== UserStatus.ACTIVE) {
        throw new UserStatusForbiddenError(id, { has: status, required: UserStatus.ACTIVE });
    }
    if (_.isNil(cryptoKey)) {
        throw new UserCryptoKeyNotFoundError(id);
    }
    if (cryptoKey.value !== item.stub.user.publicKey) {
        throw new UserCryptoKeyInvalidError(id);
    }
}

async function getUserStubHolder<U>(target: any, args: Array<any>): Promise<IUserStubHolder<U>> {
    let holder = getStubHolder(target, args) as IUserStubHolder<U>;
    let destroyAsync = holder.destroyAsync;
    holder.destroyAsync = async (): Promise<void> => {
        await destroyAsync.call(holder);
        if (!_.isNil(holder.manager)) {
            holder.manager.destroy();
            holder.manager = null;
        }
        holder.user = null;
    }
    return holder;
}
