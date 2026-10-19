import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        DatabaseModule
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService]
})
export class CourseModule { }