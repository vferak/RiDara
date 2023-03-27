import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../shared/user/user.entity';
import { OntologyService } from '../ontology/ontology.service';
import { Template } from './template.entity';
import * as fs from 'fs';
import { BpmnService } from '../bpmn/bpmn.service';
import { TemplateNodeService } from './templateNode/templateNode.service';

@Controller('template')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly ontologyService: OntologyService,
        private readonly bpmnService: BpmnService,
        private readonly templateNodeService: TemplateNodeService,
    ) {}

    @Post()
    public async create(
        @CurrentUser() currentUser: User,
        @Body('ontologyFileUuid') ontologyFileUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const ontologyFile = await this.ontologyService.getOneFileByUuid(
            ontologyFileUuid,
        );

        return await this.templateService.create(
            currentUser,
            ontologyFile,
            createTemplateDto,
        );
    }

    @Patch(':templateUuid')
    public async edit(
        @Param('templateUuid') templateUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        return await this.templateService.edit(template, createTemplateDto);
    }

    @Get(':templateUuid/file')
    public async getTemplateFile(
        @Param('templateUuid') templateUuid: string,
    ): Promise<string> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        return fs.readFileSync(await template.getDraftFileName()).toString();
    }

    @Get(':templateUuid')
    public async getTemplate(
        @Param('templateUuid') templateUuid: string,
    ): Promise<Template> {
        return await this.templateService.getOneByUuid(templateUuid);
    }

    @Patch('save-file')
    public async saveTemplateFile(
        @Body('templateUuid') templateUuid: string,
        @Body('bpmnFileData') bpmnFileData: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        const draftFileName = await template.getDraftFileName();

        fs.writeFileSync(draftFileName, bpmnFileData);

        const bpmnData = await this.bpmnService.parseBpmnFile(draftFileName);

        await this.templateNodeService.createFromBpmnData(bpmnData, template);
    }

    @Get()
    public async getAllForUser(@CurrentUser() user: User): Promise<Template[]> {
        return await user.getTemplates();
    }

    @Patch(':templateUuid/publish')
    public async publishTemplate(
        @Param('templateUuid') templateUuid: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        await this.templateService.publishNewTemplateVersion(template);
    }
}
