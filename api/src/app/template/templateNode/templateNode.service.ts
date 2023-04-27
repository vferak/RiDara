import { Injectable } from '@nestjs/common';
import { TemplateNodeRepository } from './templateNode.repository';
import { Template } from '../template.entity';
import { TemplateNode } from './templateNode.entity';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';
import { OntologyNodeRepository } from '../../ontology/ontologyNode/ontologyNode.repository';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';

@Injectable()
export class TemplateNodeService {
    public constructor(
        private readonly templateNodeRepository: TemplateNodeRepository,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async createFromBpmnData(
        bpmnElementData: BpmnElementData[],
        templateVersion: TemplateVersion,
    ): Promise<void> {
        await this.dropNodesForTemplateVersion(templateVersion);

        for (const element of bpmnElementData) {
            const ontologyNode =
                await this.ontologyNodeRepository.findOneOrFail(
                    element.getUpmmUuid(),
                );

            const templateNode = TemplateNode.create(
                templateVersion,
                ontologyNode,
                element.getElementId(),
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
