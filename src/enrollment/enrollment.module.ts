import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { EnrollmentsController } from './enrollment.controller';
import { EnrollmentsService } from './enrollment.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        DatabaseModule
    ],
    controllers: [EnrollmentsController],
    providers: [EnrollmentsService],
    exports: [EnrollmentsService]
})
export class EnrollmentModule { }