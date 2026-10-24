import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService]
})
export class CourseModule { }