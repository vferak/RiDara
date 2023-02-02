import { Injectable } from '@nestjs/common';
import { Template } from './template.entity';
import { TemplateRepository } from './template.repository';
import { User } from '../shared/user/user.entity';
import { OntologyFile } from '../ontology/ontologyFile/ontologyFile.entity';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplateService {
    public constructor(
        private readonly templateRepository: TemplateRepository,
    ) {}

    public async getOneByUuid(templateUuid: string): Promise<Template> {
        return this.templateRepository.findOneOrFail({ uuid: templateUuid });
    }

    public async create(
        user: User,
        ontologyFile: OntologyFile,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const template = Template.create(user, ontologyFile, createTemplateDto);
        await this.templateRepository.persistAndFlush(template);

        return template;
    }
}
