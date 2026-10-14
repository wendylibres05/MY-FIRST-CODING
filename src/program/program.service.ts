import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProgramsService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createProgram(program_name: string, degree_type: string, total_units?: number | null) {
        const units = total_units ?? null;
        const [result] = await this.pool().execute<OkPacket>(
            'INSERT INTO program (program_name, degree_type, total_units) VALUES (?, ?, ?)',
            [program_name, degree_type, units]
        );
        return { program_id: result.insertId, program_name, degree_type, total_units: units };
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT program_id, program_name, degree_type, total_units FROM program'
        );
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT program_id, program_name, degree_type, total_units FROM program WHERE program_id = ?',
            [id]
        );
        const program = rows[0];
        if (!program) throw new NotFoundException(`Program ${id} not found`);
        return program;
    }

    async updateProgram(id: number, data: {
        program_name?: string;
        degree_type?: string;
        total_units?: number
    } = {}) {
        const fields: string[] = [];
        const values: any[] = [];


        if (data?.program_name) {
            fields.push('program_name = ?');
            values.push(data.program_name);
        }
        if (data?.degree_type) {
            fields.push('degree_type = ?');
            values.push(data.degree_type);
        }
        if (data?.total_units !== undefined) {
            fields.push('total_units = ?');
            values.push(data.total_units);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        await this.pool().execute(
            `UPDATE program SET ${fields.join(', ')} WHERE program_id = ?`,
            values
        );
        return this.findById(id);
    }

    async deleteProgram(id: number) {
        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM program WHERE program_id = ?',
            [id]
        );
        if (res.affectedRows === 0) throw new NotFoundException(`Program ${id} not found`);
        return { deleted: true };
    }
}