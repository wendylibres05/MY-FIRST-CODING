import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InstructorsController } from './instructor.controller';
import { InstructorsService } from './instructor.service';

@Module({
    imports: [DatabaseModule],
    controllers: [InstructorsController],
    providers: [InstructorsService]
})
export class InstructorModule { }