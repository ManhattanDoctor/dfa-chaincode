import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper, ObjectUtil } from '@ts-core/common';
import { Variables } from '@project/common/hlf';
import { User, UserRole } from '@project/common/hlf';
import { UserAlreadyExistsError, UserNotFoundError } from '@project/common/hlf';
import { IUserAddDto, IUserEditDto, IUserGetDto, UserAddedEvent, UserEditedEvent } from '@project/common/hlf/transport';
import { IUserStubHolder } from '@project/module/core/guard';
import { SignatureInvalidError } from '@hlf-core/transport-chaincode';
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
        /*
        let address = EthereumUtil.getAddressFromSignature(params.signature);
        if (!EthereumUtil.isAddressesEqual(address, params.signature.publicKey)) {
            throw new SignatureInvalidError(`Invalid signature for address "${address}"`);
        }

        let uid = User.createUid(address);
        if (await holder.stub.hasState(uid)) {
            throw new UserAlreadyExistsError(address);
        }
        if (!(await holder.manager.has(params.inviterUid))) {
            throw new UserNotFoundError(params.inviterUid);
        }
        let item = User.create(address, params.inviterUid, holder.stub.transaction.date);
        ObjectUtil.copyPartial(params, item, ['wallet', 'roles']);
        await holder.manager.save(item);
        await holder.stub.dispatch(new UserAddedEvent(item));
        return item;
        */
       return null;
    }

    public async seed(holder: IUserStubHolder): Promise<void> {
        /*
        let item = User.create(Variables.root.address, Variables.platform.uid, created);
        root.roles = Object.values(UserRole);
        await holder.manager.save(root);

        await holder.stub.dispatch(new UserAddedEvent(root));
        */
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
}
