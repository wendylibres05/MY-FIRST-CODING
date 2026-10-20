import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly users: any[] = [];

    async findByUsername(username: string) {
        return this.users.find(u => u.username === username);
    }

    async findById(id: number) {
        return this.users.find(u => u.id === id);
    }

    async findByRefreshToken(token: string) {
        return this.users.find(u => u.refreshToken === token);
    }

    async setRefreshToken(userId: number, token: string | null) {
        const user = this.users.find(u => u.id === userId);
        if (user) user.refreshToken = token;
    }

    async create(data: { username: string; password: string; role: string }) {
        const newUser = {
            id: this.users.length + 1,
            ...data,
            refreshToken: null
        };
        this.users.push(newUser);
        return newUser;
    }
}