import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import * as N3 from 'n3/lib';
import * as fs from 'fs';
import { join } from 'path';
import * as process from 'process';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Public()
    @Get('/ttl')
    public ttlTest(): object[] {
        const ttlStream = fs.readFileSync(
            join(
                process.cwd(),
                'public',
                'turtle',
                'UnifiedProcessMetaModel.ttl',
            ),
            'utf-8',
        );

        const parser = new N3.Parser({ format: 'Turtle' });
        const quads: N3.Quad[] = parser.parse(ttlStream);

        const goals = quads.filter((quad) =>
            quad._subject.id.includes('#Goal'),
        );

        return goals;
    }
}
