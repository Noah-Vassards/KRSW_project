import { Controller, Delete, Get, Ip, Request, UseGuards } from "@nestjs/common";
import { DoesUserExist } from "../../core/guards/doesUserExist.guard";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(DoesUserExist)
    @Delete('deleteByMail')
    async deleteByMail(@Request() req) {
        console.debug(req.query || req.body.email)
        return await this.usersService.delete(req.query.email || req.body.email)
    }

    @UseGuards(DoesUserExist)
    @Get('movies')
    async getMovies(@Request() req) {
        console.debug(req.query || req.body.email)
        return await this.usersService.movies(req.query.email || req.body.email)
    }

    @Get()
    async getAll(@Ip() ip) {
        if (ip !== '::1') {
            return []
        }
        return await this.usersService.findAll();
    }
}