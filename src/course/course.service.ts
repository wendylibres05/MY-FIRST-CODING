import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CoursesService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createCourse(
        course_code: string,
        course_name: string,
        credits: number,
        program_id: number,
        instructor_id: number
    ) {
        try {
            const [result] = await this.pool().execute<OkPacket>(
                `INSERT INTO course (course_code, course_name, credits, program_id, instructor_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [course_code, course_name, credits, program_id, instructor_id]
            );
            return {
                course_id: result.insertId,
                course_code,
                course_name,
                credits,
                program_id,
                instructor_id
            };
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `program_id ${program_id} or instructor_id ${instructor_id} does not exist. Create them first!`
                );
            }
            throw err;
        }
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT c.course_id, c.course_code, c.course_name, c.credits, c.program_id, c.instructor_id,
                    p.program_name,
                    i.first_name AS instructor_first_name, i.last_name AS instructor_last_name
             FROM course c
             LEFT JOIN program p ON c.program_id = p.program_id
             LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
             ORDER BY c.course_id`
        );
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT c.course_id, c.course_code, c.course_name, c.credits, c.program_id, c.instructor_id,
                    p.program_name,
                    i.first_name AS instructor_first_name, i.last_name AS instructor_last_name
             FROM course c
             LEFT JOIN program p ON c.program_id = p.program_id
             LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
             WHERE c.course_id = ?`,
            [id]
        );
        const course = rows[0];
        if (!course) throw new NotFoundException(`Course ${id} not found`);
        return course;
    }

    async updateCourse(
        id: number,
        data: {
            course_code?: string;
            course_name?: string;
            credits?: number;
            program_id?: number;
            instructor_id?: number;
        } = {}
    ) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data?.course_code !== undefined) {
            fields.push('course_code = ?');
            values.push(data.course_code);
        }
        if (data?.course_name !== undefined) {
            fields.push('course_name = ?');
            values.push(data.course_name);
        }
        if (data?.credits !== undefined) {
            fields.push('credits = ?');
            values.push(data.credits);
        }
        if (data?.program_id !== undefined) {
            fields.push('program_id = ?');
            values.push(data.program_id);
        }
        if (data?.instructor_id !== undefined) {
            fields.push('instructor_id = ?');
            values.push(data.instructor_id);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        try {
            await this.pool().execute(
                `UPDATE course SET ${fields.join(', ')} WHERE course_id = ?`,
                values
            );
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `program_id ${data.program_id} or instructor_id ${data.instructor_id} does not exist`
                );
            }
            throw err;
        }

        return this.findById(id);
    }

    async deleteCourse(id: number) {
        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM course WHERE course_id = ?',
            [id]
        );
        if (res.affectedRows === 0) throw new NotFoundException(`Course ${id} not found`);
        return { deleted: true };
    }
}