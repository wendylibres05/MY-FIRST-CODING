import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './course.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.coursesService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.coursesService.findById(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: {
        course_code: string;
        course_name: string;
        units?: number;
        description?: string;
    }) {
        return this.coursesService.createCourse(body);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: {
            course_code?: string;
            course_name?: string;
            units?: number;
            description?: string;
        }
    ) {
        return this.coursesService.updateCourse(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.deleteCourse(+id);
    }
}