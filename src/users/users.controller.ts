import { Body, Controller, Get, HttpCode, HttpStatus, Post, Headers, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
    ) {}

    @Post('/auth/register')
    public register(@Body() body: RegisterDto) {
        return this.usersService.register(body);
    }

    @Post('/auth/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginDto) {
        return this.usersService.login(body);
    }

    @UseGuards(AuthGuard)
    @Get('/current-user')
    public getCurrentUser(@Headers() headers: any) {
        return this.usersService.getCurrentUser(headers.authorization);
    }
}