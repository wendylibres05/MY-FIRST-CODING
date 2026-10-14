import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class StudentsService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createStudent(
        first_name: string,
        last_name: string,
        birth_date: string,
        enrollment_year: number,
        program_id?: number | null
    ) {

        if (!first_name?.trim()) throw new BadRequestException('first_name is required');
        if (!last_name?.trim()) throw new BadRequestException('last_name is required');
        if (!birth_date) throw new BadRequestException('birth_date is required (format: YYYY-MM-DD)');
        if (!enrollment_year) throw new BadRequestException('enrollment_year is required');

        const pid = program_id ?? null;

        try {
            const [result] = await this.pool().execute<OkPacket>(
                `INSERT INTO student (first_name, last_name, birth_date, enrollment_year, program_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [first_name.trim(), last_name.trim(), birth_date, enrollment_year, pid]
            );

            return {
                student_id: result.insertId,
                first_name,
                last_name,
                birth_date,
                enrollment_year,
                program_id: pid
            };
        } catch (err: any) {
            // 
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `program_id ${program_id} does not exist in the program table. Create the program first!`
                );
            }
            throw err;
        }
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT s.student_id, s.first_name, s.last_name, s.birth_date,
                    s.enrollment_year, s.program_id, p.program_name
             FROM student s
             LEFT JOIN program p ON s.program_id = p.program_id`
        );
        return rows;
    }

    async findById(id: number) {
        if (!id || isNaN(id)) throw new BadRequestException('Valid student ID is required');

        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT s.student_id, s.first_name, s.last_name, s.birth_date,
                    s.enrollment_year, s.program_id, p.program_name
             FROM student s
             LEFT JOIN program p ON s.program_id = p.program_id
             WHERE s.student_id = ?`,
            [id]
        );

        const student = rows[0];
        if (!student) throw new NotFoundException(`Student ${id} not found`);
        return student;
    }

    async updateStudent(
        id: number,
        data: {
            first_name?: string;
            last_name?: string;
            birth_date?: string | null;
            enrollment_year?: number | null;
            program_id?: number | null;
        } = {}
    ) {
        if (!id || isNaN(id)) throw new BadRequestException('Valid student ID is required');

        const fields: string[] = [];
        const values: any[] = [];

        if (data.first_name?.trim()) {
            fields.push('first_name = ?');
            values.push(data.first_name.trim());
        }
        if (data.last_name?.trim()) {
            fields.push('last_name = ?');
            values.push(data.last_name.trim());
        }
        if (data.birth_date !== undefined) {
            fields.push('birth_date = ?');
            values.push(data.birth_date);
        }
        if (data.enrollment_year !== undefined) {
            fields.push('enrollment_year = ?');
            values.push(data.enrollment_year);
        }
        if (data.program_id !== undefined) {
            fields.push('program_id = ?');
            values.push(data.program_id);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        try {
            await this.pool().execute(
                `UPDATE student SET ${fields.join(', ')} WHERE student_id = ?`,
                values
            );
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `program_id ${data.program_id} does not exist in the program table`
                );
            }
            throw err;
        }

        return this.findById(id);
    }

    async deleteStudent(id: number) {
        if (!id || isNaN(id)) throw new BadRequestException('Valid student ID is required');

        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM student WHERE student_id = ?',
            [id]
        );

        if (res.affectedRows === 0) {
            throw new NotFoundException(`Student ${id} not found`);
        }
        return { deleted: true };
    }
}