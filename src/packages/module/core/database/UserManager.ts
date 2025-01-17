import { User } from '@project/common/hlf';
import { EntityManagerImpl, IStub } from '@hlf-core/transport-chaincode';
import { UID, getUid, ILogger, CryptoKey, ICryptoKey } from '@hlf-core/common';
import * as _ from 'lodash';

export class UserManager extends EntityManagerImpl<User> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, stub: IStub) {
        super(logger, stub, User)
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: User, details?: Array<keyof User>): Promise<void> {
        await super.loadDetails(item, details);
        if (_.isEmpty(details)) {
            return;
        }
        if (_.isNil(item.cryptoKey) && details.includes('cryptoKey')) {
            item.cryptoKey = await this.cryptoKeyGet(item);
        }
    }

    public async remove(item: UID): Promise<void> {
        await this.stub.removeState(this.getCryptoKeyUid(item));
        await super.remove(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async serialize(item: User): Promise<any> {
        delete item.cryptoKey;
        return super.serialize(item);
    }

    // --------------------------------------------------------------------------
    //
    //  CryptoKey Methods
    //
    // --------------------------------------------------------------------------

    public async cryptoKeyGet(user: UID): Promise<ICryptoKey> {
        return this.stub.getState(this.getCryptoKeyUid(user), CryptoKey);
    }

    public async cryptoKeySet(user: UID, item: ICryptoKey): Promise<void> {
        if (!_.isNil(user) && !_.isNil(item)) {
            await this.stub.putState(this.getCryptoKeyUid(user), item, { isValidate: true, isTransform: true, isSortKeys: true });
        }
    }

    protected getCryptoKeyUid(user: UID): string {
        return `→${this.prefix}~cryptoKey:${getUid(user)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return User.PREFIX;
    }
}
