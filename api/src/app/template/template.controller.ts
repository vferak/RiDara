import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../shared/user/user.entity';
import { OntologyService } from '../ontology/ontology.service';
import { Template } from './template.entity';
import { BpmnService } from '../bpmn/bpmn.service';
import { TemplateNodeService } from './templateNode/templateNode.service';
import { UserRole } from '../shared/user/role/userRole.enum';
import { UserRoles } from '../shared/user/role/userRole.decorator';
import { FileService } from '../common/file/file.service';
import { FileData } from '../common/file/file.data';
import { BpmnElementData } from '../bpmn/bpmnElement.data';
import { TemplateAnalyzeData } from '../ontology/ontologyNode/templateAnalyze.data';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('template')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly ontologyService: OntologyService,
        private readonly bpmnService: BpmnService,
        private readonly templateNodeService: TemplateNodeService,
        private readonly fileService: FileService,
    ) {}

    @Post()
    @UserRoles(UserRole.ADMIN)
    public async create(
        @CurrentUser() currentUser: User,
        @Body('ontologyFileUuid') ontologyFileUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const ontologyFile = await this.ontologyService.getOneFileByUuid(
            ontologyFileUuid,
        );

        return await this.templateService.createWithBlankFile(
            currentUser,
            ontologyFile,
            createTemplateDto,
        );
    }

    @Patch('save-file')
    @UserRoles(UserRole.ADMIN)
    public async saveTemplateFile(
        @Body('templateUuid') templateUuid: string,
        @Body('bpmnFileData') bpmnFileData: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        const draftFileName = await template.getDraftFileName();
        this.fileService.writeFile(
            FileData.createFromFilePathWithName(draftFileName),
            bpmnFileData,
        );

        const bpmnDatas = await this.bpmnService.parseBpmnFile(
            draftFileName,
            false,
            false,
        );
        const allBpmnElements: BpmnElementData[] = bpmnDatas.flatMap((obj) =>
            obj.getElements(),
        );
        await this.templateNodeService.createFromBpmnData(
            allBpmnElements,
            await template.getVersionDraft(),
        );
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    public async importFile(
        @CurrentUser() currentUser: User,
        @UploadedFile() file: Express.Multer.File,
        @Body('ontologyFileUuid') ontologyFileUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const ontologyFile = await this.ontologyService.getOneFileByUuid(
            ontologyFileUuid,
        );

        return await this.templateService.create(
            currentUser,
            ontologyFile,
            file.buffer,
            createTemplateDto
        );
    }

    @Patch(':templateUuid')
    @UserRoles(UserRole.ADMIN)
    public async edit(
        @Param('templateUuid') templateUuid: string,
        @Body() createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        return await this.templateService.edit(template, createTemplateDto);
    }

    @Delete(':templateUuid')
    @UserRoles(UserRole.ADMIN)
    public async delete(
        @Param('templateUuid') templateUuid: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid)

        return await this.templateService.delete(template);
    }

    @Get(':templateUuid/file')
    public async getTemplateFile(
        @Param('templateUuid') templateUuid: string,
    ): Promise<string> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        return this.fileService
            .readFile(
                FileData.createFromFilePathWithName(
                    await template.getDraftFileName(),
                ),
            )
            .toString();
    }

    @Get(':templateUuid')
    public async getTemplate(
        @Param('templateUuid') templateUuid: string,
    ): Promise<Template> {
        return await this.templateService.getOneByUuid(templateUuid);
    }

    @Get()
    public async getAllForUser(): Promise<Template[]> {
        return await this.templateService.getTemplates();
    }

    @Patch(':templateUuid/publish')
    @UserRoles(UserRole.ADMIN)
    public async publishTemplate(
        @Param('templateUuid') templateUuid: string,
    ): Promise<void> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        await this.templateService.publishNewTemplateVersion(template);
    }

    @Get(':templateUuid/analyze')
    @UserRoles(UserRole.ADMIN)
    public async analyzeTemplate(
        @Param('templateUuid') templateUuid: string,
    ): Promise<TemplateAnalyzeData[]> {
        const template = await this.templateService.getOneByUuid(templateUuid);
        const templateBpmnData = await this.bpmnService.parseBpmnFile(
            await template.getDraftFileName(),
            true,
            false,
        );

        if (templateBpmnData.length === 1) {
            const element = templateBpmnData[0].getElements();
            if (element[0].getUpmmUuid() === '/12/12/12') {
                const templateAnalyzeData: TemplateAnalyzeData =
                    new TemplateAnalyzeData(
                        '/12/12/12',
                        element[0].getOutgoing(),
                        element[0].getOutgoing(),
                    );
                return [templateAnalyzeData];
            }
        }

        const allBpmnTemplateElementData: BpmnElementData[] =
            templateBpmnData.flatMap((obj) => obj.getElements());

        const templateBpmnElements = allBpmnTemplateElementData;
        const ontologyFile = await template.getOntologyFile();
        const ontologyNodesByFile = await ontologyFile.getNodes();

        //GROUP processes by id of parrent
        const groupedArray = templateBpmnElements.reduce((obj, item) => {
            if (!obj[item.getParentId()]) {
                obj[item.getParentId()] = [];
            }
            obj[item.getParentId()].push(item);
            return obj;
        }, {});

        const resultArray: BpmnElementData[][] = Object.values(groupedArray);

        const relationAnalyzedArray = [];
        for (const templateElement of resultArray) {
            const ontologyNodesByFileFiltered = ontologyNodesByFile.filter(
                (ontologyNode) => {
                    return templateElement.some(
                        (template) =>
                            template.getUpmmUuid() === ontologyNode.getUuid(),
                    );
                },
            );
            const relationAnalyzed =
                await this.templateService.analyzeTemplateByUPMM(
                    templateElement,
                    ontologyNodesByFileFiltered,
                );

            relationAnalyzedArray.push(relationAnalyzed);
        }
        // formating data inside array of objects
        const mergedRelationAnalyzedData = relationAnalyzedArray.flatMap(
            (innerArray) => [...innerArray],
        );
        return mergedRelationAnalyzedData;
    }
}
