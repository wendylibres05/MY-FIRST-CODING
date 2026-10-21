import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructor.service';
// import { AuthGuard } from '@nestjs/jwt'; // uncomment if using JWT auth

@Controller('instructor')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { }

    @Get()
    getAll() {
        return this.instructorsService.getAll();
    }

    @Get(':id')
    findById(@Param('id') id: number) {
        return this.instructorsService.findById(id);
    }

    @Post()
    create(
        @Body() body: {
            first_name: string;
            last_name: string;
            email: string;
            program_id?: number | null;
        }
    ) {
        return this.instructorsService.createInstructor(
            body.first_name,
            body.last_name,
            body.email,
            body.program_id
        );
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() body: {
            first_name?: string;
            last_name?: string;
            email?: string;
            program_id?: number | null;
        }
    ) {
        return this.instructorsService.updateInstructor(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.instructorsService.deleteInstructor(id);
    }
}