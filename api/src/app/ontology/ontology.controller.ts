import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyService } from './ontology.service';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { OntlogyFileByUuidPipe } from './pipes/ontlogyFile-by-uuid.pipe';
import { UserRoles } from '../shared/user/role/userRole.decorator';
import { UserRole } from '../shared/user/role/userRole.enum';
import { TurtleService } from '../shared/turtle/turtle.service';

@Controller('ontology')
export class OntologyController {
    constructor(
        private readonly ontologyService: OntologyService,
        private readonly turtleService: TurtleService,
    ) {}

    @Post('loadFile')
    @UserRoles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileOntologyDto: CreateFileOntologyDto,
    ) {
        const turtleData = this.turtleService.parseTurtleFile(file.buffer);

        await this.ontologyService.createOntologyFile(
            turtleData,
            createFileOntologyDto,
        );
    }

    @Get('files')
    @UserRoles(UserRole.ADMIN)
    public async displayFiles(): Promise<OntologyFile[]> {
        return this.ontologyService.findAll();
    }

    @Get(':uuid/nodes')
    @UserRoles(UserRole.ADMIN)
    public async displayNodes(
        @Param('uuid', OntlogyFileByUuidPipe) ontologyFile: OntologyFile,
    ): Promise<OntologyNode[]> {
        const nodes = await ontologyFile.getNodes();
        return nodes.sort((a, b) => {
            const aName = a.getName().toUpperCase();
            const bName = b.getName().toUpperCase();

            return aName > bName ? 1 : bName > aName ? -1 : 0;
        });
    }
}
