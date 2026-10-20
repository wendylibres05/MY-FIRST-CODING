import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;
        const valid = await bcrypt.compare(pass, user.password);
        if (valid) return { id: user.id, username: user.username, role: user.role };
        return null;
    }

    async register(username: string, password: string) {
        const existing = await this.usersService.findByUsername(username);
        if (existing) throw new ConflictException('Username already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create({ username, password: hashedPassword, role: 'user' });
    }

    async login(user: { id: number; username: string; role: string }) {
        const payload = { sub: user.id, username: user.username, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' } as jwt.SignOptions
        );
        await this.usersService.setRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }

    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const secret = process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret';
            const decoded = jwt.verify(refreshToken, secret) as { sub?: string | number };

            if (!decoded.sub) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const userId = Number(decoded.sub);
            if (isNaN(userId)) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const user = await this.usersService.findById(userId);
            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const found = await this.usersService.findByRefreshToken(refreshToken);
            if (!found) {
                throw new UnauthorizedException('Invalid refresh token (not found)');
            }

            const payload = { sub: found.id, username: found.username, role: found.role };
            const accessToken = this.jwtService.sign(payload);
            const newRefresh = jwt.sign(
                payload,
                secret,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' } as jwt.SignOptions
            );

            await this.usersService.setRefreshToken(found.id, newRefresh);
            return { accessToken, refreshToken: newRefresh };
        } catch {
            throw new UnauthorizedException('Could not refresh tokens');
        }
    }
}