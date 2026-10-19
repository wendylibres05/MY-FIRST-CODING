import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './course.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('course')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { return this.coursesService.getAll(); }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) { return this.coursesService.findById(+id); }

    @Post()
    create(@Body() body: {
        course_code: string;
        course_name: string;
        credits: number;
        program_id: number;
        instructor_id: number;
    }) {
        return this.coursesService.createCourse(
            body.course_code,
            body.course_name,
            body.credits,
            body.program_id,
            body.instructor_id
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: {
            course_code?: string;
            course_name?: string;
            credits?: number;
            program_id?: number;
            instructor_id?: number;
        }
    ) {
        return this.coursesService.updateCourse(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.coursesService.deleteCourse(+id); }
}