import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module'; // ✅ Add
import { ProgramsController } from './program.controller';
import { ProgramsService } from './program.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        DatabaseModule
    ],
    controllers: [ProgramsController],
    providers: [ProgramsService],
    exports: [ProgramsService]
})
export class ProgramModule { }