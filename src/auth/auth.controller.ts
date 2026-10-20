import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        return this.authService.register(body.username, body.password);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: { user: { id: number; username: string; role: string } }) {
        return this.authService.login(req.user);
    }

    @Post('logout')
    async logout(@Body('userId') userId: number) {
        return this.authService.logout(userId);
    }
}