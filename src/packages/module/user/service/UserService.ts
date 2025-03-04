import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper, TransformUtil } from '@ts-core/common';
import { Variables } from '@project/common/hlf';
import { UserStatus, User, UserRole } from '@project/common/hlf/user';
import { UserAlreadyExistsError, UserNotFoundError } from '@project/common/hlf';
import { IUserAddDto, IUserEditDto, IUserGetDto, UserAddedEvent, UserEditedEvent } from '@project/common/hlf/transport';
import { IUserStubHolder } from '@project/module/core/guard';
import { CryptoKey, UserUtil } from '@hlf-core/common';
import { IStubHolder } from '@hlf-core/chaincode';
import { UserManager } from '@project/module/core/database';
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
        let item = await this.getManager(holder).get(params.uid, params.details);
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
        await this.getManager(holder).save(item);

        let cryptoKey = item.cryptoKey = TransformUtil.toClass(CryptoKey, params.cryptoKey);
        await this.getManager(holder).cryptoKeySet(item, cryptoKey);

        await holder.stub.dispatch(new UserAddedEvent({ user: item, initiatorUid: params.initiatorUid }));
        return item;
    }

    public async edit(holder: IUserStubHolder, params: IUserEditDto): Promise<User> {
        let item = await this.getManager(holder).get(params.uid);
        if (_.isNil(item)) {
            throw new UserNotFoundError(params.uid);
        }
        if (!_.isNil(params.roles)) {
            item.roles = params.roles;
        }
        if (!_.isNil(params.status)) {
            item.status = params.status;
        }
        if (!_.isNil(params.cryptoKey)) {
            let cryptoKey = item.cryptoKey = TransformUtil.toClass(CryptoKey, params.cryptoKey);
            await this.getManager(holder).cryptoKeySet(item, cryptoKey);
        }
        await this.getManager(holder).save(item);
        await holder.stub.dispatch(new UserEditedEvent({ userUid: item.uid, initiatorUid: params.initiatorUid }));
        return item;
    }

    public async seed(holder: IUserStubHolder): Promise<void> {
        let item = Variables.seed.user;
        item.roles = Object.values(UserRole);
        item.status = UserStatus.ACTIVE;
        await this.getManager(holder).save(item);

        let cryptoKey = TransformUtil.toClass(CryptoKey, Variables.seed.cryptoKey);
        await this.getManager(holder).cryptoKeySet(item, cryptoKey);

        await holder.stub.dispatch(new UserAddedEvent({ user: item }));
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private getManager(holder: IUserStubHolder): UserManager {
        if (_.isNil(holder.manager)) {
            holder.manager = new UserManager(this.logger, holder.stub);
        }
        return holder.manager;
    }
}
