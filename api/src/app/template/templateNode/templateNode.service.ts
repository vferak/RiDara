import { Injectable } from '@nestjs/common';
import { TemplateNodeRepository } from './templateNode.repository';
import { Template } from '../template.entity';
import { TemplateNode } from './templateNode.entity';
import { BpmnData } from '../../bpmn/bpmn.data';
import { OntologyNodeRepository } from '../../ontology/ontologyNode/ontologyNode.repository';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';

@Injectable()
export class TemplateNodeService {
    public constructor(
        private readonly templateNodeRepository: TemplateNodeRepository,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async createFromBpmnData(
        bpmnData: BpmnData,
        template: Template,
    ): Promise<void> {
        const templateDraft = await template.getVersionDraft();

        await this.dropNodesForTemplateVersion(templateDraft);

        for (const element of bpmnData.getElements()) {
            const ontologyNode =
                await this.ontologyNodeRepository.findOneOrFail(
                    element.getUpmmUuid(),
                );

            const templateNode = TemplateNode.create(
                templateDraft,
                ontologyNode,
            );
            await this.templateNodeRepository.persist(templateNode);
        }

        await this.templateNodeRepository.flush();
    }

    private async dropNodesForTemplateVersion(
        templateVersion: TemplateVersion,
    ): Promise<void> {
        const templateDraftNodes = await templateVersion.getNodes();

        for (const templateNode of templateDraftNodes) {
            this.templateNodeRepository.remove(templateNode);
        }

        await this.templateNodeRepository.flush();
    }
}
