import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
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
import { EditFileOntologyDto } from './dto/edit-file-ontology.dto';

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

    @Patch(':ontologyFileUuid')
    @UserRoles(UserRole.ADMIN)
    public async edit(
        @Param('ontologyFileUuid') ontologyFileUuid: string,
        @Body() editFileOntologyDto: EditFileOntologyDto,
    ): Promise<OntologyFile> {
        const ontologyFile = await this.ontologyService.getOneFileByUuid(ontologyFileUuid)

        return await this.ontologyService.editFile(ontologyFile, editFileOntologyDto);
    }

    @Delete(':ontologyFileUuid')
    @UserRoles(UserRole.ADMIN)
    public async delete(
        @Param('ontologyFileUuid') ontologyFileUuid: string,
    ): Promise<void> {
        const ontologyFile = await this.ontologyService.getOneFileByUuid(ontologyFileUuid)

        return await this.ontologyService.deleteFile(ontologyFile);
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
