import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProgramModule } from './program/program.module';
import { StudentModule } from './student/student.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UsersModule,
        ProgramModule,
        StudentModule,
        InstructorModule,
        CourseModule,
        EnrollmentModule
    ]
})
export class AppModule { }