import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enrollment')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { return this.enrollmentsService.getAll(); }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) { return this.enrollmentsService.findById(+id); }

    @Post()
    create(@Body() body: {
        student_id: number;
        course_id: number;
        semester: string;
        school_year: string;
    }) {
        return this.enrollmentsService.createEnrollment(
            body.student_id,
            body.course_id,
            body.semester,
            body.school_year
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: {
            student_id?: number;
            course_id?: number;
            semester?: string;
            school_year?: string;
        }
    ) {
        return this.enrollmentsService.updateEnrollment(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.enrollmentsService.deleteEnrollment(+id); }
}