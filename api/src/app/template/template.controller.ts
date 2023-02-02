import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../shared/user/user.entity';
import { OntologyService } from '../ontology/ontology.service';
import { Template } from './template.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('template')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly ontologyService: OntologyService,
    ) {}

    @Post()
    public async create(
        @CurrentUser() currentUser: User,
        @Body('ontologyFileUuid') ontologyFileUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const bpmnResourcesPath = path.join(process.cwd(), 'resources', 'bpmn');

        const blankFileName = path.join(bpmnResourcesPath, 'blank.bpmn');

        const fileName = path.join(
            bpmnResourcesPath,
            'template',
            `${createTemplateDto.name}${Date.now()}.bpmn`,
        );

        fs.copyFileSync(blankFileName, fileName);
        createTemplateDto.fileName = fileName;

        const ontologyFile = await this.ontologyService.getOneFileByUuid(
            ontologyFileUuid,
        );

        return this.templateService.create(
            currentUser,
            ontologyFile,
            createTemplateDto,
        );
    }

    @Get(':templateUuid/file')
    public async getTemplateFile(
        @Param('templateUuid') templateUuid: string,
    ): Promise<string> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        return fs.readFileSync(template.getFileName()).toString();
    }

    @Patch('save-file')
    public async saveTemplateFile(
        @Body('templateUuid') templateUuid: string,
        @Body('bpmnFileData') bpmnFileData: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        fs.writeFileSync(template.getFileName(), bpmnFileData);
    }

    @Get()
    public async getAllForUser(@CurrentUser() user: User): Promise<Template[]> {
        return await user.getTemplates();
    }
}
