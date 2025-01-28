import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper, TransformUtil } from '@ts-core/common';
import { Variables } from '@project/common/hlf';
import { UserStatus, User, UserRole } from '@project/common/hlf/user';
import { UserAlreadyExistsError, UserNotFoundError } from '@project/common/hlf';
import { IUserAddDto, IUserEditDto, IUserGetDto, UserAddedEvent, UserEditedEvent } from '@project/common/hlf/transport';
import { IUserStubHolder } from '@project/module/core/guard';
import { CryptoKey, UserUtil } from '@hlf-core/common';
import * as _ from 'lodash';

@Injectable()
export class UserService extends LoggerWrapper {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async get(holder: IUserStubHolder, params: IUserGetDto): Promise<User> {
        let item = await holder.manager.get(params.uid, params.details);
        if (_.isNil(item)) {
            throw new UserNotFoundError(params.uid);
        }
        return item;
    }

    public async add(holder: IUserStubHolder, params: IUserAddDto): Promise<User> {
        let item = UserUtil.create(User, holder.stub.transaction.date, holder.stub.transaction.hash);
        if (await holder.stub.hasState(item.uid)) {
            throw new UserAlreadyExistsError(item);
        }
        item.roles = params.roles;
        item.status = UserStatus.ACTIVE;
        await holder.manager.save(item);

        let cryptoKey = TransformUtil.toClass(CryptoKey, params.cryptoKey);
        await holder.manager.cryptoKeySet(item, cryptoKey);

        await holder.stub.dispatch(new UserAddedEvent(item));
        return item;
    }

    public async edit(holder: IUserStubHolder, params: IUserEditDto): Promise<User> {
        let item = await holder.manager.get(params.uid);
        if (_.isNil(item)) {
            throw new UserNotFoundError(params.uid);
        }
        if (!_.isNil(params.roles)) {
            item.roles = params.roles;
        }
        if (!_.isNil(params.status)) {
            item.status = params.status;
        }
        await holder.manager.save(item);
        await holder.stub.dispatch(new UserEditedEvent({ userUid: item.uid }));
        return item;
    }

    public async seed(holder: IUserStubHolder): Promise<void> {
        let item = Variables.seed.user;
        item.roles = Object.values(UserRole);
        item.status = UserStatus.ACTIVE;
        await holder.manager.save(item);

        let cryptoKey = TransformUtil.toClass(CryptoKey, Variables.seed.cryptoKey);
        await holder.manager.cryptoKeySet(item, cryptoKey);

        await holder.stub.dispatch(new UserAddedEvent(item));
    }
}
