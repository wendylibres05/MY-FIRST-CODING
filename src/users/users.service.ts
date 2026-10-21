import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OkPacket, RowDataPacket } from 'mysql2';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) { }

    async getAll() {
        const [rows] = await this.db.getPool().query<RowDataPacket[]>('SELECT id, username FROM users');
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.db.getPool().query<RowDataPacket[]>(
            'SELECT id, username FROM users WHERE id = ?', [id]
        );
        return rows[0] || null;
    }

    async findByUsername(username: string) {
        const [rows] = await this.db.getPool().query<RowDataPacket[]>(
            'SELECT * FROM users WHERE username = ?', [username]
        );
        return rows[0] || null;
    }

    async createUser(username: string, password: string) {
        const [result] = await this.db.getPool().query<OkPacket>(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        return { id: result.insertId, username };
    }

    async updateUser(id: number, data: { username?: string; password?: string }) {
        await this.db.getPool().query('UPDATE users SET ? WHERE id = ?', [data, id]);
        return { message: 'User updated' };
    }

    async deleteUser(id: number) {
        await this.db.getPool().query('DELETE FROM users WHERE id = ?', [id]);
        return { message: 'User deleted' };
    }
}