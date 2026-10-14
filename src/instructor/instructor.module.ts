import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { InstructorsController } from './instructor.controller';
import { InstructorsService } from './instructor.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        DatabaseModule
    ],
    controllers: [InstructorsController],
    providers: [InstructorsService],
    exports: [InstructorsService]
})
export class InstructorModule { }