import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { InstructorModule } from './instructors/instructor.module';
import { StudentModule } from './student/student.module';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        CourseModule,
        EnrollmentModule,
        InstructorModule,
        StudentModule
    ]
})
export class AppModule { }