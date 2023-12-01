// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from 'passport-google-oauth20'
// import { UsersService } from "../users/users.service";

// @Injectable()
// export class GoogleOAuth2Strategy extends PassportStrategy(Strategy, 'google') {
//     constructor(private readonly userService: UsersService) {
//         super({
//             clientID: 'GOOGLE_CLIENT_ID',
//             clientSecret: 'GOOGLE_CLIENT_SECRET',
//             callbackURL: '/auth/google/callback',
//         });
//     }

//     async validate(
//         accessToken: string,
//         refreshToken: string,
//         profile: any
//     ): Promise<void> {
//         const user = await this.userService.findOneByEmail(profile.email);

//         if (!user) {
//             throw new UnauthorizedException('You are not authorized to perform the operation');
//         }

//         return user;
//     }
// }