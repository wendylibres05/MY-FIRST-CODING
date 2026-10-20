import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProgramService } from './program.service';

@Controller('programs')  // ⚠️ Check spelling: "programs" NOT "program"
export class ProgramController {
    constructor(private readonly programService: ProgramService) { }

    @Post()
    create(@Body() data: any) {
        return this.programService.create(data);
    }

    @Get()
    findAll() {
        return this.programService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.programService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.programService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.programService.remove(+id);
    }
}