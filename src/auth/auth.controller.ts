import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        if (!body.username?.trim() || !body.password?.trim()) {
            throw new BadRequestException('Username and password are required');
        }
        return await this.usersService.createUser(body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        if (!body.username?.trim() || !body.password?.trim()) {
            throw new BadRequestException('Username and password are required');
        }
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) return { error: 'Invalid credentials' };
        return await this.authService.login(user);
    }
}