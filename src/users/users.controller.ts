import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('Users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    // Get all Users (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.UsersService.getAll();
    }

    // Get single employee by id (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.UsersService.findById(+id);
    }

    // Create employee (open - for demo)
    @Post()
    async create(@Body() body: { username: string; password: string }) {
        return this.UsersService.createUser(body.username, body.password);
    }

    // Update employee (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.UsersService.updateUser(+id, body);
    }

    // Delete employee (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.UsersService.deleteUser(+id);
    }
}
