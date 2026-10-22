import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CoursesService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createCourse(data: {
        course_code: string;
        course_name: string;
        units?: number;
        description?: string;
    }) {
        try {
            const [result] = await this.pool().execute<OkPacket>(
                `INSERT INTO course (course_code, course_name, units, description)
                 VALUES (?, ?, ?, ?)`,
                [data.course_code, data.course_name, data.units ?? null, data.description ?? null]
            );
            return {
                course_id: result.insertId,
                ...data
            };
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException(
                    `Course code '${data.course_code}' already exists.`
                );
            }
            throw err;
        }
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT course_id, course_code, course_name, units, description
             FROM course
             ORDER BY course_id`
        );
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT course_id, course_code, course_name, units, description
             FROM course
             WHERE course_id = ?`,
            [id]
        );
        const course = rows[0];
        if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
        return course;
    }

    async updateCourse(
        id: number,
        data: {
            course_code?: string;
            course_name?: string;
            units?: number;
            description?: string;
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
        if (data?.units !== undefined) {
            fields.push('units = ?');
            values.push(data.units);
        }
        if (data?.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        try {
            const [res] = await this.pool().execute<OkPacket>(
                `UPDATE course SET ${fields.join(', ')} WHERE course_id = ?`,
                values
            );
            if (res.affectedRows === 0) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException(
                    `Course code '${data.course_code}' already exists.`
                );
            }
            throw err;
        }

        return this.findById(id);
    }

    async deleteCourse(id: number) {
        try {
            const [res] = await this.pool().execute<OkPacket>(
                'DELETE FROM course WHERE course_id = ?',
                [id]
            );
            if (res.affectedRows === 0) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }
            return { deleted: true };
        } catch (err: any) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new BadRequestException(
                    `Cannot delete course ${id} because it is referenced in active enrollments.`
                );
            }
            throw err;
        }
    }
}