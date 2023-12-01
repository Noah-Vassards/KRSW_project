import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';

/**
 * Service responsible for authentication-related operations.
 * @class
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
    ) { }

    /**
     * Validates a user's credentials.
     * @param {string} username - The username.
     * @param {string} pass - The password.
     * @returns {Promise<any>} - A promise resolving to the validated user if successful, or null if validation fails.
     */
    async validateUser(username: string, pass: string) {
        console.debug('----------')
        console.debug(username)
        console.debug(pass)
        console.debug('----------')

        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);
        // console.debug("user debug", user)
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.dataValues.password);
        console.debug("password match", match)
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    /**
     * Logs in a user.
     * @param {User} user - The user object.
     * @returns {Promise<any>} - A promise resolving to the login response, including the user.
     */
    public async login(userInfo: any): Promise<any> {
        console.info("user", userInfo)
        console.debug(userInfo.password)

        return { user: userInfo };
    }

    /**
     * Retreive user and send it a mail to create a new password.
     * @param {string} userEmail - The user's email.
     * @returns {Promise<void>} - A promise resolving after the password reset process is complete.
     */
    public async resetPassword(userEmail: string): Promise<void> {
        console.info("email", userEmail)
        const user = await this.userService.findOneByEmail(userEmail)
        if (!user) {
            return null
        }
        const { password, ...result } = user['dataValues'];
    }

    /**
     * Resets the password for a user with the final password.
     * @param {number} userId - The user's ID.
     * @param {string} newPass - The new password.
     * @returns {Promise<void>} - A promise resolving after the password reset process is complete.
     */
    public async resetPasswordFinal(userId: number, newPass: string): Promise<void> {
        console.info("id", userId);
        const user = await this.userService.findOneById(userId);
        console.debug(user);
        if (!user) {
            return (null);
        }
        user.password = await this.hashPassword(newPass);
        await user.save()
        const { password, ...result } = user['dataValues'];
        console.log("-------------------------")
        console.debug(user.dataValues.email);
        console.debug(password);
        console.log("-------------------------")
    }

    /**
     * Creates a new user and its associated Token.
     * @param {UserDto} user - The user data.
     * @returns {Promise<any>} - A promise resolving to the created user and token.
     */
    public async create(user: UserDto): Promise<any> {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        console.log('----------------')
        console.log(result)

        return { user: result };
    }

    /**
     * Hash the given password using bcrypt
     * @param {string} password - the password to be hashed
     * @returns {Promise<any>} - A promise resolving in the hashed password
     */
    private async hashPassword(password: string): Promise<any> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    /**
     * Compare both given hashed password using bcrypt
     * @param {string} enteredPassword - The password sent by the user
     * @param dbPassword - The password stored in the database
     * @returns {Promise<any>} - A promise resolving in the result of the comparison; true if the two password match, false otherwise
     */
    private async comparePassword(enteredPassword: string, dbPassword: string): Promise<any> {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}