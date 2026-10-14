import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';       // ✅ Must match your folder path
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProgramModule } from './program/program.module';
import { StudentModule } from './student/student.module';
import { InstructorModule } from './instructor/instructor.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UsersModule,
        ProgramModule,
        StudentModule,
        InstructorModule
    ]
})
export class AppModule { }