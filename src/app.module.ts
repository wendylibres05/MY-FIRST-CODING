import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProgramModule } from './program/program.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
    imports: [
        AuthModule,
        ProgramModule,
        InstructorModule,
        CourseModule,
        StudentModule,
        EnrollmentModule,
    ],
})
export class AppModule { }