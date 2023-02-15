import { Injectable } from '@nestjs/common';
import { TemplateNodeRepository } from './templateNode.repository';
import { Template } from '../template.entity';
import { TemplateNode } from './templateNode.entity';
import { BpmnData } from '../../bpmn/bpmn.data';
import { OntologyNodeRepository } from '../../ontology/ontologyNode/ontologyNode.repository';

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
        for (const element of bpmnData.getElements()) {
            const ontologyNode =
                await this.ontologyNodeRepository.findOneOrFail(
                    element.getUpmmUuid(),
                );

            const templateNode = TemplateNode.create(template, ontologyNode);
            await this.templateNodeRepository.persist(templateNode);
        }

        await this.templateNodeRepository.flush();
    }
}
