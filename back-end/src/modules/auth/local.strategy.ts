import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Local authentication strategy.
 * @class
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    /**
     * Creates an instance of LocalStrategy.
     * @param {AuthService} authService - The authentication service.
     */
    constructor(
        private readonly authService: AuthService,
    ) {
        super({ usernameField: 'email' });
    }

    /**
     * Validates the username and password for local authentication.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise<any>} - A promise resolving to the authenticated user if successful.
     * @throws {BadRequestException} - Throws a bad request exception if the user credentials are invalid.
     */
    async validate(email: string, password: string): Promise<any> {
        console.log('------ LOCAL STARTEGY --------')
        console.log(email)
        console.log(password)
        const user = await this.authService.validateUser(email, password);
        console.debug("user id ----->", user?.id)
        console.log("validate", user)
        if (!user) {
            throw new BadRequestException('Invalid user credentials');
        }
        return user;
    }
}