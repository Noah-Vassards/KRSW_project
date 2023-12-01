import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../core/constants';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

/**
 * Service responsible for managing users.
 * @class
 */
@Injectable()
export class UsersService {

    /**
     * Creates an instance of UsersService.
     * @param {typeof User} userRepository - The user repository.
     */
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    ) { }

    /**
     * Creates a new user.
     * @param {UserDto} user - The user data.
     * @returns {Promise<User>} - A promise resolving to the created user.
     */
    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    /**
     * Finds all users in database
     * @returns {Promise<User[]>} - A promise resoling in an array of users
     */
    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll<User>();
    }

    /**
     * Finds a user by email.
     * @param {string} email - The email of the user to find.
     * @returns {Promise<User>} - A promise resolving to the found user.
     */
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    /**
     * Finds a user by ID.
     * @param {number} id - The ID of the user to find.
     * @returns {Promise<User>} - A promise resolving to the found user.
     */
    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

    /**
     * Delete a user by email
     * @param {string} email - The email address of the user to delete
     */
    async delete(email: string): Promise<number> {
        const users = await this.userRepository.findAll({ where: { email } })
        return await this.userRepository.destroy({ where: { email } })
    }

    async deleteAll() {
        return await this.userRepository.destroy()
    }
}