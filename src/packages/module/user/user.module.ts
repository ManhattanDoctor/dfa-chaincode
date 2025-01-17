import { Module } from '@nestjs/common';
import { UserService } from './service';
import { UserEditHandler, UserGetHandler, UserAddHandler } from './handler';

@Module({
    controllers: [
        UserGetHandler,
        UserAddHandler,
        UserEditHandler
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
