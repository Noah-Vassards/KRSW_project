import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { MoviesModule } from '../movies/movies.module';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    MoviesModule
   ],
  providers: [
    AuthService,
    LocalStrategy,
    // JwtStrategy,
  ],
  controllers: [AuthController]
})
export class AuthModule {}
