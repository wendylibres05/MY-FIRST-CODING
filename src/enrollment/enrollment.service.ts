import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class EnrollmentsService {
    constructor(private db: DatabaseService) { }
    private pool = () => this.db.getPool();

    async createEnrollment(
        student_id: number,
        course_id: number,
        semester: string,
        school_year: string
    ) {
        try {
            const [result] = await this.pool().execute<OkPacket>(
                `INSERT INTO enrollment (student_id, course_id, semester, school_year)
                 VALUES (?, ?, ?, ?)`,
                [student_id, course_id, semester, school_year]
            );
            return {
                enrollment_id: result.insertId,
                student_id,
                course_id,
                semester,
                school_year
            };
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `student_id ${student_id} or course_id ${course_id} does not exist. Create them first!`
                );
            }
            throw err;
        }
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT e.enrollment_id, e.student_id, e.course_id, e.semester, e.school_year,
                    s.first_name AS student_first_name, s.last_name AS student_last_name,
                    c.course_code, c.course_name
             FROM enrollment e
             LEFT JOIN student s ON e.student_id = s.student_id
             LEFT JOIN course c ON e.course_id = c.course_id
             ORDER BY e.enrollment_id`
        );
        return rows;
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT e.enrollment_id, e.student_id, e.course_id, e.semester, e.school_year,
                    s.first_name AS student_first_name, s.last_name AS student_last_name,
                    c.course_code, c.course_name
             FROM enrollment e
             LEFT JOIN student s ON e.student_id = s.student_id
             LEFT JOIN course c ON e.course_id = c.course_id
             WHERE e.enrollment_id = ?`,
            [id]
        );
        const enrollment = rows[0];
        if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
        return enrollment;
    }

    async updateEnrollment(
        id: number,
        data: {
            student_id?: number;
            course_id?: number;
            semester?: string;
            school_year?: string;
        } = {}
    ) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data?.student_id !== undefined) {
            fields.push('student_id = ?');
            values.push(data.student_id);
        }
        if (data?.course_id !== undefined) {
            fields.push('course_id = ?');
            values.push(data.course_id);
        }
        if (data?.semester) {
            fields.push('semester = ?');
            values.push(data.semester);
        }
        if (data?.school_year) {
            fields.push('school_year = ?');
            values.push(data.school_year);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        try {
            await this.pool().execute(
                `UPDATE enrollment SET ${fields.join(', ')} WHERE enrollment_id = ?`,
                values
            );
        } catch (err: any) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new BadRequestException(
                    `student_id ${data.student_id} or course_id ${data.course_id} does not exist`
                );
            }
            throw err;
        }

        return this.findById(id);
    }

    async deleteEnrollment(id: number) {
        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM enrollment WHERE enrollment_id = ?',
            [id]
        );
        if (res.affectedRows === 0) throw new NotFoundException(`Enrollment ${id} not found`);
        return { deleted: true };
    }
}