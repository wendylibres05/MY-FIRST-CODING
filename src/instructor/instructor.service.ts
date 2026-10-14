import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class InstructorsService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createInstructor(
        first_name: string,
        last_name: string,
        email: string,
        program_id?: number | null
    ) {
        const pid = program_id ?? null;

        try {
            const [result] = await this.pool().execute<OkPacket>(
                'INSERT INTO instructor (first_name, last_name, email, program_id) VALUES (?, ?, ?, ?)',
                [first_name, last_name, email, pid]
            );
            return {
                instructor_id: result.insertId,
                first_name,
                last_name,
                email,
                program_id: pid
            };
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(`program_id ${program_id} does not exist. Create the program first!`);
            }
            throw err;
        }
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT i.instructor_id, i.first_name, i.last_name, i.email, i.program_id, p.program_name
             FROM instructor i
             LEFT JOIN program p ON i.program_id = p.program_id`
        );
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT i.instructor_id, i.first_name, i.last_name, i.email, i.program_id, p.program_name
             FROM instructor i
             LEFT JOIN program p ON i.program_id = p.program_id
             WHERE i.instructor_id = ?`,
            [id]
        );
        const instructor = rows[0];
        if (!instructor) throw new NotFoundException(`Instructor ${id} not found`);
        return instructor;
    }

    async updateInstructor(id: number, data: {
        first_name?: string;
        last_name?: string;
        email?: string;
        program_id?: number | null;
    } = {}) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data?.first_name) {
            fields.push('first_name = ?');
            values.push(data.first_name);
        }
        if (data?.last_name) {
            fields.push('last_name = ?');
            values.push(data.last_name);
        }
        if (data?.email) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data?.program_id !== undefined) {
            fields.push('program_id = ?');
            values.push(data.program_id);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        try {
            await this.pool().execute(
                `UPDATE instructor SET ${fields.join(', ')} WHERE instructor_id = ?`,
                values
            );
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(`program_id ${data.program_id} does not exist`);
            }
            throw err;
        }

        return this.findById(id);
    }

    async deleteInstructor(id: number) {
        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM instructor WHERE instructor_id = ?',
            [id]
        );
        if (res.affectedRows === 0) throw new NotFoundException(`Instructor ${id} not found`);
        return { deleted: true };
    }
}