import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserAlreadyExist, DoesUserExist, DoesUserIdExist } from '../../core/guards/doesUserExist.guard';
import { Request } from 'express';

/**
 * Controller responsible for handling authentication-related requests.
 * @class
 */
@Controller('account')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Logs in a user with provided credentials.
     * @param {Request} request - The request object.
     * @returns {Promise<any>} - A promise resolving to the login response.
     */
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() request: Request) {
        // console.log("debug --------------")
        // console.debug(request)
        // console.debug(request.body)
        console.debug(request)
        // console.log("--------------------")
        // console.log('test login')
        return await this.authService.login(request['user']);
    }

    /**
     * Registers a new user.
     * @param {UserDto} user - The user data.
     * @returns {Promise<any>} - A promise resolving to the registration response.
     */
    @UseGuards(DoesUserAlreadyExist)
    @Post('signup')
    async signUp(@Body() user: UserDto) {
        console.debug("user", user)
        // console.debug(user['token'])
        return await this.authService.create(user);
    }

    /**
     * Resets the password for a user.
     * @param {Request} request - The request object.
     * @returns {Promise<any>} - A promise resolving to the reset password response.
     */
    
    @UseGuards(DoesUserExist)
    @Post('resetPassword')
    async resetPassword(@Req() request: Request) {
        // console.debug("body", request.body)
        // console.debug(request.cookies)
        return await this.authService.resetPassword(request.body.email);
    }

    /**
     * Resets the password for a user with the final password.
     * @param {Request} request - The request object.
     * @returns {Promise<any>} - A promise resolving to the reset password final response.
     */
    @UseGuards(DoesUserIdExist)
    @Post('resetPasswordFinal')
    async resetPasswordFinal(@Req() request: Request) {
        // console.debug("body", request.body)
        return await this.authService.resetPasswordFinal(request.body.id, request.body.password);
    }
}