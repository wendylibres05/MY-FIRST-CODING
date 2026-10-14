import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('student')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { return this.studentsService.getAll(); }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) { return this.studentsService.findById(+id); }

    @Post()
    create(@Body() body: {
        first_name: string;
        last_name: string;
        birth_date: string;
        enrollment_year: number;
        program_id?: number;
    }) {
        return this.studentsService.createStudent(
            body.first_name,
            body.last_name,
            body.birth_date,
            body.enrollment_year,
            body.program_id
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.studentsService.updateStudent(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentsService.deleteStudent(+id);
    }
}