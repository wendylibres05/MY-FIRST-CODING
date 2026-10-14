import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('instructor')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { return this.instructorsService.getAll(); }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) { return this.instructorsService.findById(+id); }

    @Post()
    create(@Body() body: {
        first_name: string;
        last_name: string;
        email: string;
        program_id?: number;
    }) {
        const pid = body.program_id ?? null;
        return this.instructorsService.createInstructor(
            body.first_name,
            body.last_name,
            body.email,
            pid
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: {
            first_name?: string;
            last_name?: string;
            email?: string;
            program_id?: number | null;
        }
    ) {
        return this.instructorsService.updateInstructor(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.instructorsService.deleteInstructor(+id); }
}