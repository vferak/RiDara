import { Module } from '@nestjs/common';
import { TurtleService } from './turtle.service';

@Module({
    providers: [TurtleService],
    exports: [TurtleService],
})
export class TurtleModule {}
