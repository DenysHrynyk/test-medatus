import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UsersService } from './users.service';
import { NotAcceptableException } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    //register
    @Post('/register')
    async addUser(
        @Body('password') userPassword: string,
        @Body('username') userName: string,
    ) {
        const user = await this.usersService.getUser(userName);
        if(user){
            throw new NotAcceptableException(`user with ${userName} allready exist`);
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
        const result = await this.usersService.insertUser(
            userName,
            hashedPassword,
        );
        return {
            message: 'User successfully registered',
            userId: result.id,
            userName: result.username
        };
    }
    //Post / Login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req): any {
        return {
            User: req.user,
            message: 'User logged in'
        };
    }
    //Post / Login

    @UseGuards(AuthenticatedGuard)
    @Put('/change-password')
    async recovery(
        @Request() req: any,
        @Body('oldPassword') oldPassword: string,
        @Body('newPassword') newPassword: string,) {

        if (!req.session) {
            throw new NotAcceptableException('log in first');
        }
        const user = await this.usersService.getUser(req.user.userName);

        const passwordValid = await bcrypt.compare(oldPassword, user.password)

        if (!passwordValid) {
            throw new NotAcceptableException('old password is wrong');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await this.usersService.updateUser(
            user._id,
            hashedPassword
        );
        req.session.destroy();
        return {
            message: 'password successfully updated',
            result: result
        };

    }
    //Get / protected
    @UseGuards(AuthenticatedGuard)
    @Get('/protected')
    getHello(@Request() req): string {
        return req.user;
    }
    //Get / logout
    @Get('/logout')
    logout(@Request() req): any {
        req.session.destroy();

        return { message: 'The user session has ended' }
    }
}