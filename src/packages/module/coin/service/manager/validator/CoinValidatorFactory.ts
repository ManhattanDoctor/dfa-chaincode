import { ClassType, TransformUtil, UnreachableStatementError } from "@ts-core/common";
import { ICoinValidator } from "./ICoinValidator";
import { CoinValidatorAmount } from "./CoinValidatorAmount";
import { ICoin } from "@project/common/hlf/coin";
import { CoinPermissionType, ICoinPermission } from "@project/common/hlf/coin/permission";
import { CoinValidatorWhitelist } from "./CoinValidatorWhitelist";
import { CoinValidatorBlacklist } from "./CoinValidatorBlacklist";
import { CoinValidatorEmission } from "./CoinValidatorEmission";
import * as _ from 'lodash';

export class CoinValidatorFactory {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static create<C extends ICoin, P extends ICoinPermission>(item: P): ICoinValidator<C, P> {
        let classType: ClassType<ICoinValidator> = null;
        switch (item.type) {
            case CoinPermissionType.AMOUNT:
                classType = CoinValidatorAmount;
                break;
            case CoinPermissionType.EMISSION:
                classType = CoinValidatorEmission;
                break;
            case CoinPermissionType.WHITELIST:
                classType = CoinValidatorWhitelist;
                break;
            case CoinPermissionType.BLACKLIST:
                classType = CoinValidatorBlacklist;
                break;
            default:
                throw new UnreachableStatementError(item.type);
        }
        return TransformUtil.toClass(classType, item);

    }
}