import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProgramsService } from './program.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('program')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { return this.programsService.getAll(); }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) { return this.programsService.findById(+id); }

    @Post()
    create(@Body() body: { program_name: string; degree_type: string; total_units?: number }) {
        const units = body.total_units ?? null;
        return this.programsService.createProgram(body.program_name, body.degree_type, units);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: { program_name?: string; degree_type?: string; total_units?: number }
    ) {

        return this.programsService.updateProgram(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.programsService.deleteProgram(+id); }
}