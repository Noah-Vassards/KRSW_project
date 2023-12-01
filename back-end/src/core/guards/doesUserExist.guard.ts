import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotImplementedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';

/**
 * A guard that checks if a user with the given email already exists.
 * Throws a BadRequestException if the user already exists.
 */
@Injectable()
export class DoesUserAlreadyExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request?.body)
        console.log(request?.body?.email)
        return this.validateRequest(request?.body?.email);
    }
    
    async validateRequest(email: string) {
        console.log("HERE")
        if (!email) {
            throw new BadRequestException('No email address provided') // to add to DoD
        }
        const userExist = await this.userService.findOneByEmail(email);
        if (userExist) {
            throw new BadRequestException('This email already exists');
        }
        return true;
    }
}

/**
 * A guard that checks if a user with the given email exists.
 * Throws a NotImplementedException if the user does not exist.
 */
@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request?.body?.email || request?.query?.email);
    }

    async validateRequest(email: string) {
        console.log(email)
        if (!email) {
            throw new NotImplementedException('No email address provided')
        }
        const userExist = await this.userService.findOneByEmail(email);
        if (!userExist) {
            throw new NotImplementedException('User unknown');
        }
        return true;
    }
}

/**
 * A guard that checks if a user with the given ID exists.
 * Throws a NotImplementedException if the user does not exist.
 */
@Injectable()
export class DoesUserIdExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request?.body?.id);
    }

    async validateRequest(id: number) {
        if (!id) {
            throw new BadRequestException('User id not provided');
        }
        const userExist = await this.userService.findOneById(id);
        if (!userExist) {
            throw new NotImplementedException('User unknown');
        }
        return true;
    }
}